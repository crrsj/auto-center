package br.com.mecanica.excessoes;

public class ServicoNaoEncontrado extends RuntimeException {
    public ServicoNaoEncontrado(String mensagem) {
        super(mensagem);
    }

    public ServicoNaoEncontrado(){
        super();
    }
}
