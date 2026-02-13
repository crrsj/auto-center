package br.com.mecanica.service;

import br.com.mecanica.dto.VeiculoDTO;
import br.com.mecanica.entity.Veiculo;
import br.com.mecanica.excessoes.ClienteNaoEncontrado;
import br.com.mecanica.excessoes.VeiculoNaoEncontrado;
import br.com.mecanica.repository.ClienteRepository;
import br.com.mecanica.repository.VeiculoRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class VeiculoService {

    private final ClienteRepository clienteRepository;
    private final VeiculoRepository veiculoRepository;
    private final ModelMapper modelMapper;

    public VeiculoDTO salvarVeiculo(Long clienteId, VeiculoDTO veiculoDTO){
        var cliente = clienteRepository.findById(clienteId).orElseThrow(()->new ClienteNaoEncontrado("Cliente não encontrado."));
        var veiculo = modelMapper.map(veiculoDTO, Veiculo.class);
        veiculo.setCliente(cliente);
       var veiculoSalvo = veiculoRepository.save(veiculo);
       return modelMapper.map(veiculoSalvo, VeiculoDTO.class);
    }


    public Page<VeiculoDTO>listarVeiculos(Pageable pageable){
        return veiculoRepository.findAll(pageable).map(veiculos->modelMapper.map(veiculos, VeiculoDTO.class));
    }

    public VeiculoDTO buscarVeiculoPorId(Long id){
        var veiculo = veiculoRepository.findById(id).orElseThrow(()->new VeiculoNaoEncontrado( "Veiculo não encontrado."));
        return modelMapper.map(veiculo, VeiculoDTO.class);
    }

    public VeiculoDTO buscarPorPlaca(String placa){
        var veiculo = veiculoRepository.findByPlaca(placa).orElseThrow(()->new VeiculoNaoEncontrado( "Veiculo não encontrado."));
        return modelMapper.map(veiculo, VeiculoDTO.class);
    }

    public VeiculoDTO atualizarVeiculo(Long id, VeiculoDTO veiculoDTO){
        var veiculo = veiculoRepository.findById(id).orElseThrow(()->new VeiculoNaoEncontrado( "Veiculo não encontrado."));
        modelMapper.map(veiculoDTO,veiculo);
        var veiculoNovo = veiculoRepository.save(veiculo);
        return modelMapper.map(veiculoDTO, VeiculoDTO.class);
    }

    public void excluirVeiculo(Long id){
        var veiculo = veiculoRepository.findById(id).orElseThrow(()->new VeiculoNaoEncontrado( "Veiculo não encontrado."));
        veiculoRepository.delete(veiculo);
    }
}
