package br.com.mecanica.controller;

import br.com.mecanica.dto.ServicoDTO;
import br.com.mecanica.dto.VeiculoDTO;
import br.com.mecanica.service.ServicoService;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ServicoController {

    private final ServicoService servicoService;

    @PostMapping("/{clienteId}/{veiculoId}")
    public ResponseEntity<ServicoDTO>salvarServico(@PathVariable Long clienteId ,@PathVariable Long veiculoId, @Valid @RequestBody ServicoDTO servicoDTO ){
        var servico = servicoService.salvarServico(clienteId,veiculoId,servicoDTO);
        var uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(servico.getId()).toUri();
        return ResponseEntity.created(uri).body(servico);
    }

    @GetMapping
    public ResponseEntity<Page<ServicoDTO>>listarServicos(Pageable pageable){
        Page<ServicoDTO>servicos = servicoService.listarTodos(pageable);
        return ResponseEntity.ok(servicos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServicoDTO>buscarServicoPorId(@PathVariable Long id){
        return ResponseEntity.ok(servicoService.buscarServicoPorId(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ServicoDTO>atualizarServico(@PathVariable Long id,@RequestBody @Valid ServicoDTO servicoDTO){
        return ResponseEntity.ok(servicoService.atualizarServico(id,servicoDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>excluirServico(@PathVariable Long id){
        servicoService.excluirServicc(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ordem")
    public ResponseEntity<ServicoDTO>buscarPorOrdem(@PathParam("ordemServico") Integer ordemServico){
        return ResponseEntity.ok(servicoService.buscarPorOrdem(ordemServico));
    }

    @GetMapping("/orcamentos")
    public ResponseEntity<List<ServicoDTO>>listarOrcamentos(){
        return ResponseEntity.ok(servicoService.buscarTodosEmOrcamento());
    }
    @GetMapping("/emServico")
    public ResponseEntity<List<ServicoDTO>>listarEmServico(){
        return ResponseEntity.ok(servicoService.buscarTodosOsServicos());
    }
}
