package br.com.mecanica.service;

import br.com.mecanica.dto.ServicoDTO;
import br.com.mecanica.entity.Servico;
import br.com.mecanica.enums.StatusServico;
import br.com.mecanica.excessoes.ClienteNaoEncontrado;
import br.com.mecanica.excessoes.ServicoNaoEncontrado;
import br.com.mecanica.excessoes.VeiculoNaoEncontrado;
import br.com.mecanica.repository.ClienteRepository;
import br.com.mecanica.repository.ServicoRepository;
import br.com.mecanica.repository.VeiculoRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class ServicoService {

    private final ServicoRepository servicoRepository;
    private final ClienteRepository clienteRepository;
    private final ModelMapper modelMapper;
    private final VeiculoRepository veiculoRepository;


    public ServicoDTO salvarServico(Long clienteId,Long veiculoId,ServicoDTO servicoDTO){
        var cliente = clienteRepository.findById(clienteId).orElseThrow(()->new ClienteNaoEncontrado("Cliente não encontrado."));
        var veiculo = veiculoRepository.findById(veiculoId).orElseThrow(()->new VeiculoNaoEncontrado( "Veiculo não encontrado."));

        var servico = modelMapper.map(servicoDTO, Servico.class);
        servico.setCliente(cliente);
        servico.setVeiculo(veiculo);
        servico.setOrdemServico(gerarOrdemServicoUnica());
        var servicoSalvo = servicoRepository.save(servico);
        return modelMapper.map(servicoSalvo,ServicoDTO.class);
    }

    public Page<ServicoDTO>listarTodos(Pageable pageable){
        return servicoRepository.findAll(pageable).map(servico -> modelMapper.map(servico,ServicoDTO.class));
    }

    private Integer gerarOrdemServicoUnica() {
        Random random = new Random();
        Integer novaOrdem;
        boolean jaExiste;

        do {

            novaOrdem = random.nextInt(9000) + 1000;

            jaExiste = servicoRepository.findByOrdemServico(novaOrdem).isPresent();
        } while (jaExiste);

        return novaOrdem;
    }


    public ServicoDTO buscarServicoPorId(Long id){
        var servico = servicoRepository.findById(id).orElseThrow(()->new ServicoNaoEncontrado("Serviço não encontrado."));
        return modelMapper.map(servico,ServicoDTO.class);
    }

    public ServicoDTO buscarPorOrdem(Integer ordemServico){
        var buscar =  servicoRepository.findByOrdemServico(ordemServico).orElseThrow(()->new ServicoNaoEncontrado("Serviço não encontrado."));
        return modelMapper.map(buscar,ServicoDTO.class);
    }

    public ServicoDTO atualizarServico(Long id, ServicoDTO servicoDTO){
        var servico = servicoRepository.findById(id).orElseThrow(()->new ServicoNaoEncontrado("Serviço não encontrado."));
        modelMapper.map(servicoDTO,servico);
        var novoServico = servicoRepository.save(servico);
        return modelMapper.map(novoServico,ServicoDTO.class);
    }

    public void excluirServicc(Long id){
        var servico = servicoRepository.findById(id).orElseThrow(()->new ServicoNaoEncontrado("Serviço não encontrado."));
        servicoRepository.delete(servico);
    }

    public List<ServicoDTO>buscarTodosOsServicos(){
        return servicoRepository.findByStatusServico(StatusServico.SERVICO)
                .stream().map(servicos-> modelMapper.map(servicos,ServicoDTO.class)).toList();
    }

    public List<ServicoDTO>buscarTodosEmOrcamento(){
        return servicoRepository.findByStatusServico(StatusServico.ORCAMENTO)
            .stream().map(servicos-> modelMapper.map(servicos,ServicoDTO.class)).toList();
}

}
