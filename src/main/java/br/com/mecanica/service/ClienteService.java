package br.com.mecanica.service;

import br.com.mecanica.dto.ClienteDTO;
import br.com.mecanica.entity.Cliente;
import br.com.mecanica.excessoes.ClienteNaoEncontrado;
import br.com.mecanica.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final ModelMapper modelMapper;

    public ClienteDTO salvarCliente(ClienteDTO clienteDTO){
        var cliente = modelMapper.map(clienteDTO, Cliente.class);
        var clienteSalvo = clienteRepository.save(cliente);
        return modelMapper.map(clienteSalvo, ClienteDTO.class);
    }

    public Page<ClienteDTO>listarClientes(Pageable pageable){
        return clienteRepository.findAll(pageable).map(clientes ->modelMapper.map(clientes, ClienteDTO.class));
    }

    public ClienteDTO buscarClientePorId(Long id){
        var cliente = clienteRepository.findById(id).orElseThrow(()->new ClienteNaoEncontrado("Cliente não encontrado."));
        return modelMapper.map(cliente, ClienteDTO.class);
    }

    public ClienteDTO atualizarCliente(Long id, ClienteDTO clienteDTO){
        var cliente = clienteRepository.findById(id).orElseThrow(()->new ClienteNaoEncontrado("Cliente não encontrado."));
        modelMapper.map(clienteDTO,cliente);
        var novoCliente = clienteRepository.save(cliente);
        return modelMapper.map(novoCliente, ClienteDTO.class);
    }

    public void excluirCliente(Long id){
        var cliente = clienteRepository.findById(id).orElseThrow(()->new ClienteNaoEncontrado("Cliente não encontrado."));
        clienteRepository.delete(cliente);
    }
}
