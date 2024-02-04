import re
import requests

from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import TemplateView

class MicrosoftStandardsView(View):

    # Source:
    # https://learn.microsoft.com/en-us/openspecs/protocols/ms-protocolslp/#explore-the-protocols-documentation
    INDEXS = [
        'https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/MS-OXPROTLP/toc.json',
        'https://learn.microsoft.com/en-us/openspecs/office_protocols/MS-OFFPROTLP/toc.json',
        'https://learn.microsoft.com/en-us/openspecs/sharepoint_protocols/MS-SPPROTLP/toc.json',
        'https://learn.microsoft.com/en-us/openspecs/sql_server_protocols/MS-SQLPROTLP/toc.json',
        'https://learn.microsoft.com/en-us/openspecs/windows_protocols/MS-WINPROTLP/toc.json',
    ]

    def handle_response(self, data, url, standards_list):

        if isinstance(data, dict) == False:
            # We only handle dictionaries
            return

        for k, v in data.items():
            if isinstance(v, dict):
                self.handle_response(v, url, standards_list)

            if isinstance(v, list):
                for entry in v:
                    self.handle_response(entry, url, standards_list)

        if 'href' in data and 'toc_title' in data:
            href = data['href']
            title = data['toc_title']

            if re.match(r'^\[[A-Z-]*\]: ', title):
                standards_list.append({
                    'title': title,
                    'href': url + '/../' + href,
                })


    def get(self, *args, **kwargs):

        standards_list = []
        for url in self.INDEXS:
            response = requests.get(url)
            self.handle_response(response.json(), url, standards_list)

        return JsonResponse({
            'data': standards_list
        })


@method_decorator(csrf_exempt, name="dispatch")
class UploadView(View):

    STATUS_BAD_REQUEST = 400

    def post(self, request, *args, **kwargs):

        if request.FILES.get('f') == None:
            return JsonResponse({
                'error': {
                    'message': 'No file provided',
                }
            }, status=self.STATUS_BAD_REQUEST)

        file = request.FILES['f']
        fs = FileSystemStorage(
            location=settings.STATIC_ROOT,
            base_url=settings.STATIC_URL,
        )
        filename = fs.save(file.name, file)
        return JsonResponse({
            'data': {
                'name': filename,
                'location': fs.url(filename),
            }
        })

class ReverseSshView(TemplateView):
    template_name = 'core/reverse-ssh.sh'

    def get_context_data(self, host, port, **kwargs):
        context = super().get_context_data(host=host, port=port, **kwargs)

        with open(settings.SSH_PRIVATE_KEY_FILE, 'r') as f:
            context['private_ssh_key'] = f.read()

        with open(settings.SSH_PUBLIC_KEY_FILE, 'r') as f:
            context['public_ssh_key'] = f.read()

        context['host'] = host
        context['port'] = port
        context['username'] = settings.SSH_USER

        context['min_port'] = settings.SSH_MIN_PORT
        context['max_port'] = settings.SSH_MAX_PORT

        return context
