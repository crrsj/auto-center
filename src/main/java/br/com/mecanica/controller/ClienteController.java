package br.com.mecanica.controller;

import br.com.mecanica.dto.ClienteDTO;
import br.com.mecanica.service.ClienteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClienteController {

    private final ClienteService clienteService;

    @PostMapping
    public ResponseEntity<ClienteDTO>salvarCliente(@RequestBody @Valid ClienteDTO clienteDTO){
        var cliente = clienteService.salvarCliente(clienteDTO);
        var uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}")
                .buildAndExpand(cliente.getId()).toUri();
        return ResponseEntity.created(uri).body(cliente);
    }

    @GetMapping
    public ResponseEntity<Page<ClienteDTO>>listarClientes(Pageable pageable){
        Page<ClienteDTO> clientes = clienteService.listarClientes(pageable);
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDTO>buscarClientePorId(@PathVariable Long id){
        return ResponseEntity.ok(clienteService.buscarClientePorId(id));

    }

    @PatchMapping("/{id}")
    public ResponseEntity<ClienteDTO>atualizarClientes(@PathVariable Long id, @RequestBody ClienteDTO clienteDTO){
        return ResponseEntity.ok(clienteService.atualizarCliente(id, clienteDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>excluirCliente(@PathVariable Long id){
        clienteService.excluirCliente(id);
        return ResponseEntity.noContent().build();
    }


}
