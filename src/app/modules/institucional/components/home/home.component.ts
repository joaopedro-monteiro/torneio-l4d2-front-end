import { Component, OnInit } from '@angular/core';
import { StatusConfronto } from 'src/app/modules/cadastros/confrontos/enums/status-confronto';
import { Rodada } from 'src/app/modules/cadastros/confrontos/models/rodada';
import { ConfrontoService } from 'src/app/modules/cadastros/confrontos/services/confronto.service';
import { Jogador } from 'src/app/modules/cadastros/jogadores/models/jogador';
import { JogadorService } from 'src/app/modules/cadastros/jogadores/services/jogador.service';
import { Time } from 'src/app/modules/cadastros/times/models/time';
import { TimeService } from 'src/app/modules/cadastros/times/services/time.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  jogadores: Jogador[] | undefined;
  times: Time[] | undefined;
  classificacao: Time[] | undefined;
  rodadaAtual: number = 0;
  rodadas: Rodada[] | undefined;

  constructor(
    private jogadorService: JogadorService,
    private timeService: TimeService,
    private confrontoService: ConfrontoService,
  ) { }

  ngOnInit(): void {
    this.jogadorService.get().subscribe(jogadores => this.jogadores = jogadores);
    this.timeService.get().subscribe(times => this.times = times);
    this.timeService.classificacao().subscribe(classificacao => this.classificacao = classificacao);
    this.confrontoService.rodadas().subscribe(rodadas => {
      this.rodadas = rodadas;
      this.atualizarRodadaAtual()
    });
  }

  atualizarRodadaAtual(): void {
    let rodadaAtual = 1;

    for (const rodada of this.rodadas || []) {
      for (const confronto of rodada.confrontos || []) {
        if (!confronto.codigoCampanha)
          continue

        rodadaAtual = Math.max(rodadaAtual, rodada.rodada || 0);
      }
    }

    this.rodadaAtual = rodadaAtual - 1;
  }

  tituloRodada(rodada: Rodada): string {
    if (rodada.rodada == this.rodadaAtual + 1)
      return rodada.rodada + 'ª Rodada (Atual)';

    return rodada.rodada + 'ª Rodada'
  }
}
