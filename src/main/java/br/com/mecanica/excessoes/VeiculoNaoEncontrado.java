package br.com.mecanica.excessoes;

public class VeiculoNaoEncontrado extends RuntimeException{
    public VeiculoNaoEncontrado(String mensagem) {
        super(mensagem);
    }

    public  VeiculoNaoEncontrado(){
        super();
    }
}
