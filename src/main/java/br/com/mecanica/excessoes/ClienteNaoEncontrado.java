package br.com.mecanica.excessoes;

public class ClienteNaoEncontrado extends RuntimeException{
    public ClienteNaoEncontrado(String mensagem) {
        super(mensagem);
    }

    public ClienteNaoEncontrado(){
        super();
    }
}
