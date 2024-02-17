from django.urls import path

from . import views

app_name = 'core'
urlpatterns = [
    path('upload/', views.UploadView.as_view(), name='upload'),

    path(
        '<str:host>/<str:port>/reverse-ssh/',
        views.ReverseSshView.as_view(),
        name='reverse-ssh'
    ),

    path(
        'microsoft-standards/',
        views.MicrosoftStandardsView.as_view(),
        name='microsoft-standards'
    ),

    path(
        'rfc-list/',
        views.RfcListView.as_view(),
        name='rfc-list'
    ),
]
