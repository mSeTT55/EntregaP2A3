import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styleplatasMobile.css';
import './styleplatas.css';
import InternoAdm from '../../../../layouts/internoAdm.jsx';
import { Link, useNavigate } from 'react-router-dom';

const AtualizarPlataforma = () => {
    const navigate = useNavigate();

    const [dadosFormPlaUpd, setdadosFormPlaUpd] = useState({
        id_plata: '',
        nome_plata: '',
        imagem_pla: ''
    });

    const [dadosPlataformas, setDadosPlataformas] = useState([]);

    const limparFormulario = () => {
        setdadosFormPlaUpd({
            id_plata: '',
            nome_plata: '',
            imagem_pla: ''
        });
    };

    const formSumbit = async (pegarCada) => {
        pegarCada.preventDefault();
        limparFormulario();

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const montandoDadosPlaUpd = {
            idplataforma: dadosFormPlaUpd.id_plata,
            nome: dadosFormPlaUpd.nome_plata,
            imagemplataforma: dadosFormPlaUpd.imagem_pla
        };

        try {
            const response = await axios.put(`http://localhost:5000/plataforma/update/${montandoDadosPlaUpd.idplataforma}`, montandoDadosPlaUpd, config);
            if (response.status === 200) {
                alert('Os dados da sua plataforma foram alterados com sucesso.');
                navigate('/paineldecontrole');
            } else {
                alert('Erro ao tentar atualizar plataforma');
            }
        } catch (error) {
            alert('Digite uma ID existente na lista');
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/plataformas/get/all');
                setDadosPlataformas(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    return (
        <InternoAdm>
            <div className="text-botoes">
                <div>
                    <h1 id="editarperfil" className="minhalista">
                        Plataforma
                    </h1>
                </div>
            </div>
            <div className="conteiner-maior-adm">
                <div className="caixa-itens-up-ser">
                    <div className="setor-a">
                        <div>
                            <p className="nome-h2">Atualizar</p>
                        </div>
                        <div className="itens-tab">
                            <form onSubmit={(pegarCada) => formSumbit(pegarCada)}>
                                <div className="input-box">
                                    <input
                                        type="text"
                                        name="idplata"
                                        id="idplata"
                                        placeholder="   Digite a ID que deseja atualizar"
                                        required
                                        value={dadosFormPlaUpd.id_plata}
                                        onChange={(pegarCada) => setdadosFormPlaUpd({ ...dadosFormPlaUpd, id_plata: pegarCada.target.value })}
                                    />
                                </div>
                                <div className="input-box">
                                    <input
                                        type="text"
                                        name="nome"
                                        id="nomeplata"
                                        placeholder="   Digite o nome da série"
                                        required
                                        value={dadosFormPlaUpd.nome_plata}
                                        onChange={(pegarCada) => setdadosFormPlaUpd({ ...dadosFormPlaUpd, nome_plata: pegarCada.target.value })}
                                    />
                                </div>
                                <div className="input-box">
                                    <input
                                        type="text"
                                        name="url-img"
                                        id="plata-url"
                                        placeholder="   Digite a url em http da foto da série"
                                        required
                                        value={dadosFormPlaUpd.imagem_pla}
                                        onChange={(pegarCada) => setdadosFormPlaUpd({ ...dadosFormPlaUpd, imagem_pla: pegarCada.target.value })}
                                    />
                                </div>
                                <div className="botao-submit">
                                    <div>
                                        <button className="bt1" id="" type="submit">
                                            Atualizar
                                        </button>
                                    </div>
                                    <div>
                                        <Link to={"/paineldecontrole"}>
                                            <button className="bt2" id="" type="">
                                                Voltar
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="setor-b">
                        <div className="caixa-plataforma">
                            {dadosPlataformas.map((plataforma) => (
                                <section key={plataforma.idplataforma}>
                                    <p>ID: {plataforma.idplataforma}</p>
                                    <p>Nome: {plataforma.nome}</p>
                                    <p>Imagem: {plataforma.imagemplataforma}</p>
                                </section>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </InternoAdm>
    );
};

export default AtualizarPlataforma;