import React from 'react'
import "./login.css";

function login() {

    function submit(e) {
        e.preventDefault();
        console.log('formulaire envoyer');
    }

    return (
        <div className='login'>
            <div>
                <h1>MY IRC</h1>
                <h2>LOGIN</h2>
                <form action="" method="post">
                    <div>
                        <input type="text" name="pseudo" id="pseudo" placeholder='pseudo' />
                    </div>
                    <div>
                        <input type="email" name="emil" id="email" placeholder='email' />
                    </div>
                    <div>
                        <input type="password" name="password" id="password" placeholder='mot de passe' />
                    </div>
                    <div>
                        <input type="password" name="password" id="password" placeholder='confirmer le mot de passe' />
                    </div>
                    <div className='error'>
                    </div>
                    <div>
                        <input onClick={submit} type="button" value="Connexion" />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default login
