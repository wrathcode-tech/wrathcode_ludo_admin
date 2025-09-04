import React from 'react'
import './index.css'
import { Link } from 'react-router-dom'
import imageLight from './404Image/404.svg'
import imageDark from './404Image/404_dark.svg'
const ErrorPage = () => {
    return (
        <main className="error_page">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 align-self-center">
                      
                        <img className="move_on logo-dark" alt='404 Error' src={imageLight} />
                        <img className="move_on logo-light" alt='404 Error' src={imageDark} />

                    </div>
                    <div className="col-lg-6 align-self-center">
                        <h1>404</h1>
                        <h2>UH OH! You're lost.</h2>
                        <p>The page you are looking for does not exist.
                            How you got here is a mystery. But you can click the button below
                            to go back to the homepage.
                        </p>
                        <Link to="/" className="btn green"> <i className="ri-home-8-line"></i> Home</Link>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ErrorPage
