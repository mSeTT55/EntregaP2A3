import React, { useState, useEffect } from "react";
import { User } from "../../types/User";
import { AuthContext } from "./AuthContext";
import  {connectAPI} from "./connectAPI";

// Esta pag conecta com a API, valida se o usuário existe, pega o token da API caso o usuário exista, e começa a persistência.

export const AuthProvider = ({children}: {children: JSX.Element}) => {
    // Use state para extrair o usuário e salvar usuário caso exista na base
    const [user, setUser] = useState <User | null> (null);

    //Conexão com API
    const api = connectAPI();

    // Verificando se o usuário está logado e colocando os dados do usuário no localStorage
    useEffect(() => {
        const validateToken = () => {
            const storageData = localStorage.getItem('authToken');
            if(storageData) {
                const emailFiltrado = localStorage.getItem('emailFiltrado');
                if (emailFiltrado !== null) {
                    const meuArrayRecuperado = JSON.parse(emailFiltrado);
                    setUser(meuArrayRecuperado);
                }
            }
        }
        validateToken();
    }, []);


    //Função para colocar o token no local storage caso o usuário consiga logar e para realizar a persistência de usuário logado.
    const setToken = () =>{
        const token:number = api.createToken()
        const authToken:string = token.toString();
        localStorage.setItem('authToken', authToken);
    }

    //Verificação de usuário 
    const entrar = async (email: string, senha: string) => {
        interface dados {
            nome_completo: string;
            email: string;
            senha: string;
            confirm_senha: string;
        }
        const dadosLogin: dados [] = await api.login();

        const filtered = dadosLogin.filter((obj) => {
            return obj.email === email;                
        });

        if(filtered.length > 0 && filtered[0].senha === senha){
            const emailFiltrado = filtered[0];
            setUser(emailFiltrado);
            setToken();
            localStorage.setItem('emailFiltrado', JSON.stringify(emailFiltrado));
            return true;
        }
        return false;   
    }

    // Fazer logoff - Setando nulo no usuário e limpando local storage ao chamar a api de logout
    const sair = () => {
        api.logout();
        setUser(null);        
    }

    return (
        <AuthContext.Provider value={{user, entrar, sair}}>
            {children}
        </AuthContext.Provider>
    );
}
