import { AlertTriangle, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import type { ReactNode } from 'react';
import { Banner, Card, Heading, IconList, Reveal, Text } from '@/components/ds';
import { BANNER_EJEMPLO } from '@/lib/contenido/ejemplo-resultado';
import { getTexto } from '@/lib/contenido/textos';
import { BANNER_EJEMPLO_EN, traducir } from '@/lib/contenido/traducciones/en';
import type { Idioma } from '@/lib/i18n/idioma';
import { UI } from '@/lib/i18n/ui';
import type { AnalisisResult, DiagnosticoResult } from '@/lib/types';
import DimensionBar from './DimensionBar';
import EvidenciaPorPregunta from './EvidenciaPorPregunta';
import IcebergVisualization from './IcebergVisualization';
import RecomendacionCard from './RecomendacionCard';
import TarjetaNivel from './TarjetaNivel';

interface Props {
  resultado: DiagnosticoResult;
  scores?: AnalisisResult | null;
  /** Datos ficticios (`src/lib/contenido/ejemplo-resultado.ts`): banner + badge EJEMPLO. */
  ejemplo?: boolean;
  fecha?: string;
  /** Botones al final (nuevo diagnóstico, copiar, etc.). */
  acciones?: ReactNode;
  /** Prefijo de ids para anclas (dos resultados en la misma página). */
  idBase?: string;
  idioma?: Idioma;
}

/** Texto de alcance oficial sin el marcador de enlace (el enlace se pinta aparte). */
const ALCANCE = getTexto('alcance').cuerpo.replace('[Ver evidencia por pregunta]', '').trim();

/**
 * Resultado completo del diagnóstico. ÚNICA vista de resultado: la usan el demo de la landing
 * (con datos ficticios) y el resultado real del agente. No dupliques esta vista en otro lugar.
 */
export default function ResultadoDiagnostico({ resultado, scores, ejemplo, fecha, acciones, idBase = 'resultado', idioma = 'es' }: Props) {
  const t = UI[idioma].resultado;
  return (
    <article aria-label={`${t.articuloAria} ${resultado.municipio}`} className="flex flex-col gap-block">
      {ejemplo && <Banner variant="ejemplo">{idioma === 'en' ? BANNER_EJEMPLO_EN : BANNER_EJEMPLO}</Banner>}

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Reveal className="flex flex-col gap-6">
          <TarjetaNivel resultado={resultado} fecha={fecha} ejemplo={ejemplo} aviso={false} idioma={idioma} />
          <Card variant="flat">
            <Text variant="eyebrow">{t.sintesis}</Text>
            <Text variant="body">{resultado.resumen_territorio}</Text>
          </Card>
        </Reveal>
        <Reveal delay={0.08} className="flex flex-col gap-6">
          <Card variant="flat">
            <Text variant="eyebrow">{t.fortalezas}</Text>
            <IconList items={resultado.fortalezas} icon={CheckCircle2} tone="green" />
          </Card>
          <Card variant="flat">
            <Text variant="eyebrow">{t.brechas}</Text>
            <IconList items={resultado.brechas} icon={AlertTriangle} tone="amber" />
          </Card>
        </Reveal>
      </div>

      <Reveal>
        <Card variant="flat" padding="lg">
          <IcebergVisualization
            iceberg_id={resultado.iceberg_id}
            nivel_id={resultado.nivel_id}
            nivel_nombre={resultado.nivel_nombre}
            idioma={idioma}
            iceberg_texto_corto={resultado.iceberg_texto_corto}
            iceberg_texto_ampliado={resultado.iceberg_texto_ampliado}
            capas_activas={resultado.capas_activas}
          />
        </Card>
      </Reveal>

      <Reveal className="flex flex-col gap-6">
        <Heading as="h3" size="h3">{t.porDimension}</Heading>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resultado.dimensiones_resumen.map((d) => (
            <Card key={d.id} variant="raised" padding="sm">
              <DimensionBar {...d} idioma={idioma} />
            </Card>
          ))}
        </div>
      </Reveal>

      <Reveal className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Heading as="h3" size="h3">{t.primerasAcciones}</Heading>
          <Text variant="small">{t.rutaSugerida}</Text>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {resultado.recomendaciones.map((r, i) => (
            <RecomendacionCard key={i} {...r} idioma={idioma} />
          ))}
        </div>
      </Reveal>

      <Reveal>
        <Card variant="sage" padding="lg" className="flex-row gap-4">
          <MessageSquareQuote aria-hidden="true" className="mt-1 size-6 shrink-0 text-green-ink" />
          <Text variant="lead" tone="default">{resultado.mensaje_final}</Text>
        </Card>
      </Reveal>

      {scores?.dimensiones && (
        <Reveal className="flex flex-col gap-6">
          <div id={`${idBase}-evidencia`} className="flex scroll-mt-24 flex-col gap-2">
            <Heading as="h3" size="h3">{t.evidencia}</Heading>
            <Text variant="small">{t.evidenciaLead}</Text>
          </div>
          <EvidenciaPorPregunta scores={scores} idioma={idioma} />
        </Reveal>
      )}

      <footer className="flex flex-col gap-5 border-t border-border pt-6">
        <Text variant="small" tone="muted">
          {traducir(ALCANCE, idioma)}
          {scores?.dimensiones && (
            <>
              {' '}
              <a href={`#${idBase}-evidencia`} className="text-green-ink underline underline-offset-2">{t.verEvidencia}</a>
            </>
          )}
        </Text>
        {acciones && <div className="flex flex-wrap gap-3">{acciones}</div>}
      </footer>
    </article>
  );
}
