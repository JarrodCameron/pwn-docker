import { Link } from 'react-router-dom';
import { useState } from 'react'
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import AxiosClient from '../utils/AxiosClient';

function LoadableButton({
    isLoading,
    type="",
    normalText="Submit",
    loadingText="Submitting",
})
{
    return (
        <>
            <Button type={type} disabled={isLoading}>
                {isLoading === false && normalText}

                {isLoading === true && <>
                    <Spinner animation="border" size="sm"/>
                    <span> {loadingText}</span>
                </>}
            </Button>
        </>
    )
}

export default LoadableButton;
