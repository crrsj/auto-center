package br.com.mecanica.controller;

import br.com.mecanica.dto.VeiculoDTO;
import br.com.mecanica.service.VeiculoService;
import jakarta.validation.Valid;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/veiculos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VeiculoController {

    private final VeiculoService veiculoService;

    @PostMapping("/{clienteId}")
    public ResponseEntity<VeiculoDTO>salvarVeiculo(@PathVariable Long clienteId, @RequestBody @Valid VeiculoDTO veiculoDTO){
        var veiculo = veiculoService.salvarVeiculo(clienteId,veiculoDTO);
        var uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(veiculo.getId()).toUri();
        return ResponseEntity.created(uri).body(veiculo);
    }

    @GetMapping
    public ResponseEntity<Page<VeiculoDTO>>listarVeiculos(Pageable pageable){
        Page<VeiculoDTO>veiculos = veiculoService.listarVeiculos(pageable);
        return ResponseEntity.ok(veiculos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<VeiculoDTO>buscarVeiculoPorId(@PathVariable Long id){
        return ResponseEntity.ok(veiculoService.buscarVeiculoPorId(id));
    }

    @GetMapping("/placa")
    public ResponseEntity<VeiculoDTO>buscarPorPlaca(@PathParam("placa") String placa){
        return ResponseEntity.ok(veiculoService.buscarPorPlaca(placa));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<VeiculoDTO>atualizarVeiculo(@PathVariable Long id,@RequestBody VeiculoDTO veiculoDTO){
        return ResponseEntity.ok(veiculoService.atualizarVeiculo(id, veiculoDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>excluirVeicolo(@PathVariable Long id){
        veiculoService.excluirVeiculo(id);
        return ResponseEntity.noContent().build();
    }
}
