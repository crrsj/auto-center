package br.com.mecanica.excessoes;

import br.com.mecanica.dto.MensagemDeErro;
import br.com.mecanica.dto.ValidarCampos;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExcessoesGlobais {

    @ExceptionHandler(ClienteNaoEncontrado.class)
    public ResponseEntity<MensagemDeErro> clienteNaoEncontrado() {
        var msg = new MensagemDeErro(HttpStatus.NOT_FOUND, "Cliente não encontrado.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
    }

    @ExceptionHandler(VeiculoNaoEncontrado.class)
    public ResponseEntity<MensagemDeErro> veiculoNaoEncontrado() {
        var msg = new MensagemDeErro(HttpStatus.NOT_FOUND, "Veículo não encontrado.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
    }

    @ExceptionHandler(ServicoNaoEncontrado.class)
    public ResponseEntity<MensagemDeErro> servicoNaoEncontrado() {
        var msg = new MensagemDeErro(HttpStatus.NOT_FOUND, "Serviço não encontrado.");
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(msg);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> validandoCampos(MethodArgumentNotValidException ex) {
        var erros = ex.getFieldErrors();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erros.stream().map(ValidarCampos::new).toList());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<MensagemDeErro> placaDuplicada() {
        var msg = new MensagemDeErro(HttpStatus.BAD_REQUEST, "Placa duplicada.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
    }
}