import React, { useEffect, useState, useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { RegistrosContext } from '../../context/RegistrosContext';
import { api } from '../../services/apiClient';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import '../../styles/pages/Relatorios.css';

const Relatorios = () => {
  const { veiculos, loading: contextLoading, error: contextError } = useContext(RegistrosContext);
  const [relatoriosData, setRelatoriosData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [diasTrabalhados, setDiasTrabalhados] = useState([]);
  const [despesas, setDespesas] = useState([]);
  const [periodo, setPeriodo] = useState('mes');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [dadosGraficosReais, setDadosGraficosReais] = useState({
    performanceSemanal: [],
    distribuicaoDespesas: []
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log('🔍 Relatorios - Veículos do contexto:', veiculos);
    console.log('🔍 Relatorios - Estado atual:', { periodo });
    fetchRelatoriosData();
  }, [periodo]);

  const fetchRelatoriosData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Relatorios - Fazendo chamada para /api/relatorios/estatisticas/');
      
      const params = new URLSearchParams();
      if (periodo) params.append('periodo', periodo);
      
      console.log('🔍 Relatorios - Parâmetros:', { periodo });
      
      let response;
      try {
        response = await api.get(`/api/relatorios/estatisticas/?${params.toString()}`);
        console.log('🔍 Relatorios - Resposta dos relatórios:', response.data);
        setRelatoriosData(response.data);
      } catch (err) {
        console.warn('⚠️ Relatorios - Erro ao buscar estatísticas:', err);
        setRelatoriosData(null);
      }
      
      let diasTrabalhadosData = [];
      let despesasData = [];
      
      try {
        const diasResponse = await api.get(`/registro/api/registro-trabalho/?${params.toString()}`);
        console.log('🔍 Relatorios - Dias trabalhados:', diasResponse.data);
        diasTrabalhadosData = diasResponse.data.results || [];
        setDiasTrabalhados(diasTrabalhadosData);
      } catch (err) {
        console.warn('⚠️ Relatorios - Erro ao buscar dias trabalhados:', err);
        setDiasTrabalhados([]);
      }
      
      try {
        const despesasResponse = await api.get(`/registro/api/registro-despesa/?${params.toString()}`);
        console.log('🔍 Relatorios - Despesas:', despesasResponse.data);
        despesasData = despesasResponse.data.results || [];
        setDespesas(despesasData);
      } catch (err) {
        console.warn('⚠️ Relatorios - Erro ao buscar despesas:', err);
        setDespesas([]);
      }
      
      processarDadosGraficos(diasTrabalhadosData, despesasData);
      
    } catch (err) {
      console.error('❌ Relatorios - Erro ao carregar dados dos relatórios:', err);
      setError('Erro ao carregar dados dos relatórios: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = () => {
    if (!relatoriosData) {
      return {
        totalGanho: 0,
        totalDespesa: 0,
        lucroTotal: 0,
        totalPacotes: 0,
        pacotesEntregues: 0,
        taxaEntrega: 0,
        totalRegistros: 0,
        veiculosCadastrados: 0,
        diasTrabalhados: 0,
        diasConectado: 0
      };
    }

    return {
      totalGanho: relatoriosData.totalGanhos || 0,
      totalDespesa: 0,
      lucroTotal: relatoriosData.totalGanhos || 0,
      totalPacotes: relatoriosData.totalEntregas || 0,
      pacotesEntregues: relatoriosData.totalEntregas || 0,
      taxaEntrega: 100,
      totalRegistros: relatoriosData.diasTrabalhados || 0,
      veiculosCadastrados: relatoriosData.veiculosCadastrados || 0,
      diasTrabalhados: relatoriosData.diasTrabalhados || 0,
      diasConectado: relatoriosData.diasConectado || 0
    };
  };

  const estatisticas = calcularEstatisticas();

  const calcularAnalisesDetalhadas = () => {
    const totalDespesas = despesas.reduce((sum, despesa) => sum + (despesa.valor || 0), 0);
    const totalGanhos = diasTrabalhados.reduce((sum, dia) => sum + (dia.valor || 0), 0);
    const lucroLiquido = totalGanhos - totalDespesas;
    
    const diasComTrabalho = diasTrabalhados.length;
    const ganhoMedioDia = diasComTrabalho > 0 ? totalGanhos / diasComTrabalho : 0;
    const despesaMediaDia = diasComTrabalho > 0 ? totalDespesas / diasComTrabalho : 0;
    
    const totalEntregas = diasTrabalhados.reduce((sum, dia) => sum + (dia.quantidade_entregues || 0), 0);
    const totalNaoEntregas = diasTrabalhados.reduce((sum, dia) => sum + (dia.quantidade_nao_entregues || 0), 0);
    const taxaSucesso = (totalEntregas + totalNaoEntregas) > 0 ? (totalEntregas / (totalEntregas + totalNaoEntregas)) * 100 : 0;
    
    return {
      totalDespesas,
      totalGanhos,
      lucroLiquido,
      diasComTrabalho,
      ganhoMedioDia,
      despesaMediaDia,
      totalEntregas,
      totalNaoEntregas,
      taxaSucesso
    };
  };

  const analises = calcularAnalisesDetalhadas();

  const processarDadosGraficos = (diasTrabalhadosData = diasTrabalhados, despesasData = despesas) => {
    const performanceSemanal = [];
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    diasSemana.forEach((diaNome, index) => {
      const diaDados = diasTrabalhadosData.filter(d => {
        try {
          const dataDia = new Date(d.data);
          const diaSemana = dataDia.getDay();
          return diaSemana === index;
        } catch (e) {
          console.warn('Erro ao processar data:', d.data, e);
          return false;
        }
      });
      
      const entregas = diaDados.reduce((sum, d) => sum + (parseFloat(d.quantidade_entregues) || 0), 0);
      const ganho = diaDados.reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0);
      
      const despesa = despesasData.filter(d => {
        try {
          const dataDespesa = new Date(d.data);
          const diaSemana = dataDespesa.getDay();
          return diaSemana === index;
        } catch (e) {
          console.warn('Erro ao processar data de despesa:', d.data, e);
          return false;
        }
      }).reduce((sum, d) => sum + (parseFloat(d.valor) || 0), 0);
      
      performanceSemanal.push({
        dia: diaNome,
        entregas: Math.round(entregas),
        ganho: parseFloat(ganho.toFixed(2)),
        despesa: parseFloat(despesa.toFixed(2))
      });
    });

    const distribuicaoDespesas = [];
    const categorias = {};
    
    despesasData.forEach(despesa => {
      const categoria = despesa.tipo_despesa || 'Outros';
      const valor = parseFloat(despesa.valor) || 0;
      if (categorias[categoria]) {
        categorias[categoria] += valor;
      } else {
        categorias[categoria] = valor;
      }
    });

    const cores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff6b6b', '#4ecdc4', '#95e1d3', '#f38181', '#aa96da'];
    Object.entries(categorias).forEach(([categoria, valor], index) => {
      distribuicaoDespesas.push({
        name: categoria,
        value: parseFloat(valor.toFixed(2)),
        color: cores[index % cores.length]
      });
    });

    distribuicaoDespesas.sort((a, b) => b.value - a.value);

    setDadosGraficosReais({
      performanceSemanal,
      distribuicaoDespesas
    });
    
    console.log('📊 Dados processados para gráficos:', { performanceSemanal, distribuicaoDespesas });
  };

  const dadosGraficos = dadosGraficosReais.performanceSemanal.length > 0 && 
    dadosGraficosReais.performanceSemanal.some(d => d.entregas > 0 || d.ganho > 0 || d.despesa > 0)
    ? dadosGraficosReais 
    : {
        performanceSemanal: [
          { dia: 'Dom', entregas: 0, ganho: 0, despesa: 0 },
          { dia: 'Seg', entregas: 0, ganho: 0, despesa: 0 },
          { dia: 'Ter', entregas: 0, ganho: 0, despesa: 0 },
          { dia: 'Qua', entregas: 0, ganho: 0, despesa: 0 },
          { dia: 'Qui', entregas: 0, ganho: 0, despesa: 0 },
          { dia: 'Sex', entregas: 0, ganho: 0, despesa: 0 },
          { dia: 'Sáb', entregas: 0, ganho: 0, despesa: 0 }
        ],
        distribuicaoDespesas: despesas.length === 0 ? [
          { name: 'Nenhuma despesa', value: 1, color: '#cccccc' }
        ] : dadosGraficosReais.distribuicaoDespesas
      };

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handlePrint = () => {
    window.print();
  };

  const exportToExcel = () => {
    try {
      const dadosExcel = {
        'Resumo Geral': [
          ['Métrica', 'Valor'],
          ['Ganho Total', `R$ ${analises.totalGanhos.toFixed(2)}`],
          ['Total de Despesas', `R$ ${analises.totalDespesas.toFixed(2)}`],
          ['Lucro Líquido', `R$ ${analises.lucroLiquido.toFixed(2)}`],
          ['Taxa de Sucesso', `${analises.taxaSucesso.toFixed(1)}%`],
          ['Dias Trabalhados', analises.diasComTrabalho],
          ['Total de Entregas', analises.totalEntregas],
          ['Ganho Médio/Dia', `R$ ${analises.ganhoMedioDia.toFixed(2)}`],
          ['Despesa Média/Dia', `R$ ${analises.despesaMediaDia.toFixed(2)}`]
        ],
        'Dias Trabalhados': [
          ['Data', 'Horário Início', 'Horário Fim', 'Entregas', 'Não Entregues', 'Tipo Pagamento', 'Valor', 'Status']
        ],
        'Despesas': [
          ['Data', 'Tipo', 'Descrição', 'Valor', 'Categoria']
        ]
      };

      diasTrabalhados.forEach(dia => {
        dadosExcel['Dias Trabalhados'].push([
          dia.data,
          dia.hora_inicio,
          dia.hora_fim,
          dia.quantidade_entregues,
          dia.quantidade_nao_entregues,
          dia.tipo_pagamento === 'por_entrega' ? 'Por Entrega' : 'Diária',
          dia.valor,
          'Concluído'
        ]);
      });

      despesas.forEach(despesa => {
        dadosExcel['Despesas'].push([
          despesa.data,
          despesa.tipo_despesa,
          despesa.descricao,
          despesa.valor,
          despesa.tipo_despesa
        ]);
      });

      const wb = XLSX.utils.book_new();
      
      Object.entries(dadosExcel).forEach(([nome, dados]) => {
        const ws = XLSX.utils.aoa_to_sheet(dados);
        XLSX.utils.book_append_sheet(wb, ws, nome);
      });

      const nomeArquivo = `relatorios_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.xlsx`;
      XLSX.writeFile(wb, nomeArquivo);
      
      console.log('✅ Excel exportado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao exportar Excel:', error);
      alert('Erro ao exportar para Excel. Tente novamente.');
    }
  };

  const exportToPDF = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      let yPosition = margin;
      const lineHeight = 7;
      const sectionSpacing = 10;

      // Cores
      const primaryColor = [25, 118, 210];
      const successColor = [76, 175, 80];
      const errorColor = [244, 67, 54];
      const darkGray = [66, 66, 66];
      const lightGray = [245, 245, 245];

      // Função para adicionar nova página se necessário
      const checkPageBreak = (requiredSpace) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Função para adicionar linha
      const addLine = (text, fontSize = 10, isBold = false, color = darkGray, align = 'left') => {
        checkPageBreak(lineHeight);
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        pdf.setTextColor(...color);
        
        const xPosition = align === 'center' ? pageWidth / 2 : 
                          align === 'right' ? pageWidth - margin : margin;
        
        pdf.text(text, xPosition, yPosition, { align });
        yPosition += lineHeight;
      };

      // Função para adicionar retângulo colorido
      const addColoredBox = (x, y, width, height, color) => {
        pdf.setFillColor(...color);
        pdf.rect(x, y, width, height, 'F');
      };

      // Cabeçalho
      pdf.setFillColor(...primaryColor);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('📊 RELATÓRIO DETALHADO', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const periodoText = periodo === 'semana' ? 'Esta Semana' : 
                         periodo === 'mes' ? 'Este Mês' : 'Este Ano';
      pdf.text(`Período: ${periodoText} | Gerado em: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 
               pageWidth / 2, 30, { align: 'center' });

      yPosition = 50;

      // Resumo Executivo
      addLine('RESUMO EXECUTIVO', 16, true, primaryColor, 'center');
      yPosition += 5;

      // Cards de resumo
      const cardWidth = (pageWidth - 2 * margin - 10) / 4;
      const cardHeight = 30;
      const cardY = yPosition;

      // Card 1 - Ganho Total
      addColoredBox(margin, cardY, cardWidth, cardHeight, [102, 126, 234]);
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(8);
      pdf.text('GANHO TOTAL', margin + cardWidth / 2, cardY + 8, { align: 'center' });
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`R$ ${formatCurrency(analises.totalGanhos)}`, margin + cardWidth / 2, cardY + 18, { align: 'center' });

      // Card 2 - Despesas
      addColoredBox(margin + cardWidth + 3.33, cardY, cardWidth, cardHeight, [240, 147, 251]);
      pdf.text('DESPESAS', margin + cardWidth * 1.5 + 3.33, cardY + 8, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`R$ ${formatCurrency(analises.totalDespesas)}`, margin + cardWidth * 1.5 + 3.33, cardY + 18, { align: 'center' });

      // Card 3 - Lucro
      addColoredBox(margin + cardWidth * 2 + 6.66, cardY, cardWidth, cardHeight, [67, 233, 123]);
      pdf.text('LUCRO LÍQUIDO', margin + cardWidth * 2.5 + 6.66, cardY + 8, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`R$ ${formatCurrency(analises.lucroLiquido)}`, margin + cardWidth * 2.5 + 6.66, cardY + 18, { align: 'center' });

      // Card 4 - Taxa Sucesso
      addColoredBox(margin + cardWidth * 3 + 10, cardY, cardWidth, cardHeight, [79, 172, 254]);
      pdf.text('TAXA SUCESSO', margin + cardWidth * 3.5 + 10, cardY + 8, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`${analises.taxaSucesso.toFixed(1)}%`, margin + cardWidth * 3.5 + 10, cardY + 18, { align: 'center' });

      yPosition += cardHeight + sectionSpacing;
      pdf.setTextColor(...darkGray);

      // Métricas de Performance
      checkPageBreak(40);
      addLine('MÉTRICAS DE PERFORMANCE', 14, true, primaryColor);
      yPosition += 3;

      const metrics = [
        ['Dias Trabalhados', analises.diasComTrabalho.toString()],
        ['Total de Entregas', analises.totalEntregas.toString()],
        ['Entregas Não Realizadas', analises.totalNaoEntregas.toString()],
        ['Ganho Médio por Dia', `R$ ${formatCurrency(analises.ganhoMedioDia)}`],
        ['Despesa Média por Dia', `R$ ${formatCurrency(analises.despesaMediaDia)}`],
        ['Margem de Lucro', `${analises.totalGanhos > 0 ? ((analises.lucroLiquido / analises.totalGanhos) * 100).toFixed(1) : '0.0'}%`]
      ];

      metrics.forEach(([label, value]) => {
        checkPageBreak(lineHeight + 2);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(...darkGray);
        pdf.text(label + ':', margin, yPosition);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...primaryColor);
        pdf.text(value, pageWidth - margin, yPosition, { align: 'right' });
        yPosition += lineHeight + 2;
      });

      yPosition += sectionSpacing;

      // Tabela de Dias Trabalhados
      if (diasTrabalhados.length > 0) {
        checkPageBreak(30);
        addLine('DIAS TRABALHADOS', 14, true, primaryColor);
        yPosition += 5;

        // Cabeçalho da tabela
        const tableHeaders = ['Data', 'Horário', 'Entregas', 'Valor'];
        const colWidths = [40, 35, 30, 40];
        let xPos = margin;

        pdf.setFillColor(...lightGray);
        pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...darkGray);
        tableHeaders.forEach((header, index) => {
          pdf.text(header, xPos + colWidths[index] / 2, yPosition, { align: 'center' });
          xPos += colWidths[index] + 5;
        });
        yPosition += 10;

        // Linhas da tabela
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        diasTrabalhados.slice(0, 15).forEach((dia, index) => {
          checkPageBreak(8);
          if (index % 2 === 0) {
            pdf.setFillColor(250, 250, 250);
            pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');
          }
          
          xPos = margin;
          pdf.setTextColor(...darkGray);
          pdf.text(dia.data || '-', xPos + 5, yPosition);
          xPos += colWidths[0] + 5;
          
          pdf.text(`${dia.hora_inicio || '-'} - ${dia.hora_fim || '-'}`, xPos + 5, yPosition);
          xPos += colWidths[1] + 5;
          
          pdf.setTextColor(...successColor);
          pdf.text((dia.quantidade_entregues || 0).toString(), xPos + colWidths[2] / 2, yPosition, { align: 'center' });
          xPos += colWidths[2] + 5;
          
          pdf.setTextColor(...successColor);
          pdf.text(`R$ ${dia.valor || '0.00'}`, xPos + colWidths[3] / 2, yPosition, { align: 'center' });
          
          yPosition += 8;
        });

        if (diasTrabalhados.length > 15) {
          checkPageBreak(lineHeight);
          pdf.setFontSize(9);
          pdf.setTextColor(...darkGray);
          pdf.text(`... e mais ${diasTrabalhados.length - 15} registro(s)`, pageWidth / 2, yPosition, { align: 'center' });
          yPosition += lineHeight;
        }

        yPosition += sectionSpacing;
      }

      // Tabela de Despesas
      if (despesas.length > 0) {
        checkPageBreak(30);
        addLine('DESPESAS', 14, true, primaryColor);
        yPosition += 5;

        // Cabeçalho da tabela
        const despesaHeaders = ['Data', 'Tipo', 'Descrição', 'Valor'];
        const despesaColWidths = [35, 40, 70, 35];
        let xPos = margin;

        pdf.setFillColor(...lightGray);
        pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');
        
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(...darkGray);
        despesaHeaders.forEach((header, index) => {
          pdf.text(header, xPos + despesaColWidths[index] / 2, yPosition, { align: 'center' });
          xPos += despesaColWidths[index] + 5;
        });
        yPosition += 10;

        // Linhas da tabela
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        despesas.slice(0, 15).forEach((despesa, index) => {
          checkPageBreak(8);
          if (index % 2 === 0) {
            pdf.setFillColor(250, 250, 250);
            pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F');
          }
          
          xPos = margin;
          pdf.setTextColor(...darkGray);
          pdf.text(despesa.data || '-', xPos + 5, yPosition);
          xPos += despesaColWidths[0] + 5;
          
          pdf.text((despesa.tipo_despesa || '-').substring(0, 15), xPos + 5, yPosition);
          xPos += despesaColWidths[1] + 5;
          
          pdf.text((despesa.descricao || '-').substring(0, 30), xPos + 5, yPosition);
          xPos += despesaColWidths[2] + 5;
          
          pdf.setTextColor(...errorColor);
          pdf.text(`R$ ${despesa.valor || '0.00'}`, xPos + despesaColWidths[3] / 2, yPosition, { align: 'center' });
          
          yPosition += 8;
        });

        if (despesas.length > 15) {
          checkPageBreak(lineHeight);
          pdf.setFontSize(9);
          pdf.setTextColor(...darkGray);
          pdf.text(`... e mais ${despesas.length - 15} registro(s)`, pageWidth / 2, yPosition, { align: 'center' });
          yPosition += lineHeight;
        }
      }

      // Rodapé
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Página ${i} de ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      const nomeArquivo = `relatorio_${periodo}_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.pdf`;
      pdf.save(nomeArquivo);
      
      console.log('✅ PDF exportado com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao exportar PDF:', error);
      alert('Erro ao exportar para PDF. Tente novamente.');
    }
  };

  const definirPeriodoAutomatico = (tipo) => {
    try {
      setPeriodo(tipo);
      console.log('🔍 Relatorios - Período definido:', { tipo });
    } catch (error) {
      console.error('❌ Erro ao definir período:', error);
      alert('Erro ao definir período. Tente novamente.');
    }
  };

  const formatCurrency = (value) => {
    return Number(value || 0).toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="relatorios-container" id="relatorios-content">
      {/* Header com ações */}
      <div className="relatorios-header">
        <div className="relatorios-header-content">
          <span style={{ fontSize: '2rem' }}>📊</span>
          <div>
            <h1 className="relatorios-title">Relatórios Detalhados</h1>
            <p className="relatorios-subtitle">Análise completa da sua performance e finanças</p>
          </div>
        </div>
        <div className="relatorios-actions">
          <button 
            className="action-btn success" 
            onClick={exportToExcel}
            title="Exportar para Excel"
          >
            ⬇️
          </button>
          <button 
            className="action-btn error" 
            onClick={exportToPDF}
            title="Exportar para PDF"
          >
            🖨️
          </button>
          <button 
            className="action-btn primary" 
            onClick={handlePrint}
            title="Imprimir Relatório"
          >
            🖨️
          </button>
        </div>
      </div>

      {/* Filtros de Período */}
      {error && (
        <div className="error-alert" style={{ marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}
      <div className="filtros-card">
        <div className="filtros-header">
          <h3 className="filtros-title">🔍 Filtros de Período</h3>
        </div>
        <div className="filtros-content">
          <div className="form-group">
            <label className="form-label">Período</label>
            <select
              className="form-select"
              value={periodo}
              onChange={(e) => definirPeriodoAutomatico(e.target.value)}
            >
              <option value="semana">Esta Semana</option>
              <option value="mes">Este Mês</option>
              <option value="ano">Este Ano</option>
            </select>
          </div>
          <div className="form-group">
            <button
              className="btn btn-primary"
              onClick={fetchRelatoriosData}
              disabled={loading}
            >
              {loading ? '⏳ Carregando...' : '🔍 Aplicar Filtros'}
            </button>
          </div>
          <div className="filtros-quick-actions">
            <button
              className="btn btn-outline btn-small"
              onClick={() => definirPeriodoAutomatico('semana')}
            >
              Última Semana
            </button>
            <button
              className="btn btn-outline btn-small"
              onClick={() => definirPeriodoAutomatico('mes')}
            >
              Último Mês
            </button>
            <button
              className="btn btn-outline btn-small"
              onClick={() => definirPeriodoAutomatico('ano')}
            >
              Último Ano
            </button>
            <button
              className="btn btn-secondary btn-small"
              onClick={() => {
                setPeriodo('mes');
                setError(null);
              }}
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Resumo Principal */}
      <div className="cards-grid">
        <div className="stat-card gradient-1">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <div className="stat-card-label">Ganho Total</div>
              <div className="stat-card-value">
                R$ {formatCurrency(analises.totalGanhos)}
              </div>
            </div>
            <div className="stat-card-icon">💰</div>
          </div>
        </div>

        <div className="stat-card gradient-2">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <div className="stat-card-label">Total de Despesas</div>
              <div className="stat-card-value">
                R$ {formatCurrency(analises.totalDespesas)}
              </div>
            </div>
            <div className="stat-card-icon">🧾</div>
          </div>
        </div>

        <div className="stat-card gradient-3">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <div className="stat-card-label">Lucro Líquido</div>
              <div className="stat-card-value">
                R$ {formatCurrency(analises.lucroLiquido)}
              </div>
            </div>
            <div className="stat-card-icon">📈</div>
          </div>
        </div>

        <div className="stat-card gradient-4">
          <div className="stat-card-content">
            <div className="stat-card-info">
              <div className="stat-card-label">Taxa de Sucesso</div>
              <div className="stat-card-value">
                {analises.taxaSucesso.toFixed(1)}%
              </div>
            </div>
            <div className="stat-card-icon">⭐</div>
          </div>
        </div>
      </div>

      {/* Tabs para diferentes seções */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 0 ? 'active' : ''}`}
            onClick={() => handleTabChange(0)}
          >
            <span>📈</span>
            <span>Visão Geral</span>
          </button>
          <button
            className={`tab-button ${activeTab === 1 ? 'active' : ''}`}
            onClick={() => handleTabChange(1)}
          >
            <span>📅</span>
            <span>Dias Trabalhados</span>
          </button>
          <button
            className={`tab-button ${activeTab === 2 ? 'active' : ''}`}
            onClick={() => handleTabChange(2)}
          >
            <span>🧾</span>
            <span>Despesas</span>
          </button>
          <button
            className={`tab-button ${activeTab === 3 ? 'active' : ''}`}
            onClick={() => handleTabChange(3)}
          >
            <span>📊</span>
            <span>Gráficos</span>
          </button>
        </div>

        {/* Tab 1: Visão Geral */}
        {activeTab === 0 && (
          <div className="tab-content">
            <div className="metrics-grid">
              {/* Métricas de Performance */}
              <div className="metric-card">
                <h3 className="metric-card-title">📈 Métricas de Performance</h3>
                <div className="metric-item">
                  <span className="metric-label">Dias Trabalhados</span>
                  <span className="metric-value primary">{analises.diasComTrabalho}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${Math.min((analises.diasComTrabalho / 30) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Entregas Realizadas</span>
                  <span className="metric-value success">{analises.totalEntregas}</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${Math.min(analises.taxaSucesso, 100)}%`, background: 'linear-gradient(90deg, #4caf50, #66bb6a)' }}
                  ></div>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Ganho Médio/Dia</span>
                  <span className="metric-value info">
                    R$ {formatCurrency(analises.ganhoMedioDia)}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Despesa Média/Dia</span>
                  <span className="metric-value error">
                    R$ {formatCurrency(analises.despesaMediaDia)}
                  </span>
                </div>
              </div>

              {/* Resumo Financeiro */}
              <div className="metric-card">
                <h3 className="metric-card-title">💰 Resumo Financeiro</h3>
                <div className="metric-item">
                  <span className="metric-label">Ganho Total:</span>
                  <span className="metric-value success">
                    R$ {formatCurrency(analises.totalGanhos)}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Despesas Total:</span>
                  <span className="metric-value error">
                    R$ {formatCurrency(analises.totalDespesas)}
                  </span>
                </div>
                <div className="divider"></div>
                <div className="metric-item">
                  <span className="metric-label" style={{ fontWeight: 600, fontSize: '1rem' }}>Lucro Líquido:</span>
                  <span className={`metric-value ${analises.lucroLiquido >= 0 ? 'success' : 'error'}`} style={{ fontSize: '1.5rem' }}>
                    R$ {formatCurrency(analises.lucroLiquido)}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Margem de Lucro:</span>
                  <span className={`metric-value ${analises.lucroLiquido >= 0 ? 'success' : 'error'}`}>
                    {analises.totalGanhos > 0 ? ((analises.lucroLiquido / analises.totalGanhos) * 100).toFixed(1) : '0.0'}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dias Trabalhados */}
        {activeTab === 1 && (
          <div className="tab-content">
            <h3 className="table-title">📅 Histórico de Dias Trabalhados</h3>
            <div className="table-card">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Horário</th>
                      <th>Entregas</th>
                      <th>Não Entregues</th>
                      <th>Tipo Pagamento</th>
                      <th>Valor</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diasTrabalhados.length > 0 ? (
                      diasTrabalhados.map((dia, index) => (
                        <tr key={index}>
                          <td>{dia.data}</td>
                          <td>{dia.hora_inicio} - {dia.hora_fim}</td>
                          <td className="text-success">{dia.quantidade_entregues}</td>
                          <td className="text-error">{dia.quantidade_nao_entregues}</td>
                          <td>
                            <span className={`chip ${dia.tipo_pagamento === 'por_entrega' ? 'primary' : 'secondary'}`}>
                              {dia.tipo_pagamento === 'por_entrega' ? 'Por Entrega' : 'Diária'}
                            </span>
                          </td>
                          <td className="text-success">R$ {dia.valor}</td>
                          <td>
                            <span className="chip success">Concluído</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="table-empty">
                          Nenhum dia trabalhado registrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Despesas */}
        {activeTab === 2 && (
          <div className="tab-content">
            <h3 className="table-title">💸 Histórico de Despesas</h3>
            <div className="table-card">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Tipo</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>Categoria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {despesas.length > 0 ? (
                      despesas.map((despesa, index) => (
                        <tr key={index}>
                          <td>{despesa.data}</td>
                          <td>
                            <span className="chip warning">{despesa.tipo_despesa}</span>
                          </td>
                          <td>{despesa.descricao}</td>
                          <td className="text-error">R$ {despesa.valor}</td>
                          <td>
                            <span className="chip info">{despesa.tipo_despesa}</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="table-empty">
                          Nenhuma despesa registrada
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Gráficos */}
        {activeTab === 3 && (
          <div className="tab-content">
            <div className="charts-grid">
              {/* Gráfico de Performance Semanal */}
              <div className="chart-card wide">
                <h3 className="chart-title">📊 Performance Semanal</h3>
                {dadosGraficos.performanceSemanal.some(d => d.entregas > 0 || d.ganho > 0 || d.despesa > 0) ? (
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dadosGraficos.performanceSemanal} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey="dia" 
                          tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                          stroke="#666"
                        />
                        <YAxis 
                          yAxisId="left"
                          tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                          stroke="#666"
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                          stroke="#666"
                          tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                        />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            fontSize: isMobile ? '11px' : '12px'
                          }}
                          formatter={(value, name) => {
                            if (name === 'Entregas') {
                              return [`${value} entregas`, name];
                            }
                            return [`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, name];
                          }}
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: isMobile ? '10px' : '12px', paddingTop: '10px' }}
                          iconType="square"
                        />
                        <Bar 
                          yAxisId="left"
                          dataKey="entregas" 
                          fill="#8884d8" 
                          name="Entregas" 
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          yAxisId="right"
                          dataKey="ganho" 
                          fill="#82ca9d" 
                          name="Ganho (R$)" 
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          yAxisId="right"
                          dataKey="despesa" 
                          fill="#ffc658" 
                          name="Despesa (R$)" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="chart-empty">
                    Nenhum dado disponível para o período selecionado
                  </div>
                )}
              </div>

              {/* Gráfico de Distribuição de Despesas */}
              <div className="chart-card">
                <h3 className="chart-title">💰 Distribuição de Despesas</h3>
                {dadosGraficos.distribuicaoDespesas.length > 0 && 
                 dadosGraficos.distribuicaoDespesas[0].name !== 'Nenhuma despesa' ? (
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dadosGraficos.distribuicaoDespesas}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent, value }) => {
                            if (isMobile) return '';
                            return `${name}: ${(percent * 100).toFixed(0)}%`;
                          }}
                          outerRadius={isMobile ? 70 : 100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                        >
                          {dadosGraficos.distribuicaoDespesas.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                          ))}
                        </Pie>
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            fontSize: isMobile ? '11px' : '12px'
                          }}
                          formatter={(value, name) => [
                            `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                            name
                          ]}
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: isMobile ? '10px' : '12px', paddingTop: '10px' }}
                          iconType="circle"
                          formatter={(value) => value}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="chart-empty">
                    Nenhuma despesa registrada
                  </div>
                )}
              </div>

              {/* Gráfico de Evolução de Ganhos */}
              <div className="chart-card full">
                <h3 className="chart-title">📈 Evolução de Ganhos e Despesas</h3>
                {dadosGraficos.performanceSemanal.some(d => d.ganho > 0 || d.despesa > 0) ? (
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dadosGraficos.performanceSemanal} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorGanho" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ffc658" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis 
                          dataKey="dia" 
                          tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                          stroke="#666"
                        />
                        <YAxis 
                          tick={{ fontSize: isMobile ? 10 : 12, fill: '#666' }}
                          stroke="#666"
                          tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                        />
                        <RechartsTooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            fontSize: isMobile ? '11px' : '12px'
                          }}
                          formatter={(value) => [
                            `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                            ''
                          ]}
                        />
                        <Legend 
                          wrapperStyle={{ fontSize: isMobile ? '10px' : '12px', paddingTop: '10px' }}
                          iconType="square"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="ganho" 
                          stroke="#82ca9d" 
                          fillOpacity={1} 
                          fill="url(#colorGanho)" 
                          name="Ganho (R$)"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="despesa" 
                          stroke="#ffc658" 
                          fillOpacity={1} 
                          fill="url(#colorDespesa)" 
                          name="Despesa (R$)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="chart-empty">
                    Nenhum dado financeiro disponível
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Relatorios;
