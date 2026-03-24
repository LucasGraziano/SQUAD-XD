# /video-tools - Ferramentas de Video (FFmpeg)

Ferramentas para processamento de video usando FFmpeg (instalado). Util para editar clips do Veo 3, adicionar audio ElevenLabs, cortar, concatenar e exportar.

## Uso

```
/video-tools concat          # Concatenar clips de video
/video-tools add-audio       # Adicionar audio a video
/video-tools trim            # Cortar video
/video-tools export          # Exportar para formato de ads
/video-tools thumbnail       # Extrair thumbnail de video
```

## Comandos

### concat — Concatenar clips

Junta multiplos clips em um video unico (util para montar ads de 3-5 clips Veo 3).

Perguntar ao usuario:
1. Quais arquivos de video? (caminhos completos ou glob pattern)
2. Ordem desejada?
3. Nome do arquivo de saida?

```bash
# Criar lista de arquivos
echo "file 'clip1.mp4'" > /tmp/ffmpeg_list.txt
echo "file 'clip2.mp4'" >> /tmp/ffmpeg_list.txt
echo "file 'clip3.mp4'" >> /tmp/ffmpeg_list.txt

# Concatenar sem re-encode (rapido, se mesmo codec)
ffmpeg -f concat -safe 0 -i /tmp/ffmpeg_list.txt -c copy output.mp4

# Concatenar com re-encode (se codecs diferentes)
ffmpeg -f concat -safe 0 -i /tmp/ffmpeg_list.txt -c:v libx264 -c:a aac output.mp4
```

### add-audio — Adicionar audio

Adiciona naracao ElevenLabs ou musica de fundo ao video.

```bash
# Substituir audio
ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 output.mp4

# Mixar audio (manter audio original + adicionar musica de fundo)
ffmpeg -i video.mp4 -i music.mp3 -filter_complex "[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=2" -c:v copy output.mp4
```

### trim — Cortar video

```bash
# Cortar de 00:02 ate 00:08 (6 segundos)
ffmpeg -i input.mp4 -ss 00:00:02 -to 00:00:08 -c copy output.mp4
```

### export — Exportar para ads

Formatos otimizados para Meta Ads:

```bash
# Meta Ads: 1080x1080 (feed), H.264, AAC, max 15s
ffmpeg -i input.mp4 -vf "scale=1080:1080:force_original_aspect_ratio=decrease,pad=1080:1080:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -b:v 4M -c:a aac -t 15 output_feed.mp4

# Meta Ads: 1080x1920 (stories/reels), H.264
ffmpeg -i input.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -b:v 4M -c:a aac output_story.mp4

# Meta Ads: 1200x628 (in-stream)
ffmpeg -i input.mp4 -vf "scale=1200:628:force_original_aspect_ratio=decrease,pad=1200:628:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -b:v 4M -c:a aac output_instream.mp4
```

### thumbnail — Extrair frame

```bash
# Frame no segundo 3
ffmpeg -i input.mp4 -ss 00:00:03 -frames:v 1 thumbnail.jpg

# Frame no meio do video
ffmpeg -i input.mp4 -vf "select=eq(pict_type\,I)" -frames:v 1 thumbnail.jpg
```

## Workflow tipico para ads Zero Diastasis

```
1. Gerar clips no Veo 3 (3-5 clips de 8s cada)
2. /video-tools trim — ajustar duracao de cada clip
3. /video-tools concat — juntar na ordem do script
4. /video-tools add-audio — adicionar narracao ElevenLabs
5. /video-tools export — gerar versoes feed + story
6. /video-tools thumbnail — extrair thumbnail para Meta Ads
```

---
*AIOX Productivity — Video Tools Command (FFmpeg)*
