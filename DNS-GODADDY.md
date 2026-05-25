# Publicar anaoliveirapsi.com.br na GoDaddy

O site ja esta publicado no GitHub Pages. Para o dominio `anaoliveirapsi.com.br` abrir este site, configure o DNS na GoDaddy assim:

## 1. Dominio raiz

Remova os registros `A` atuais do tipo "Parked" ou que apontem para:

```text
13.248.243.5
76.223.105.230
```

Crie estes 4 registros:

| Tipo | Nome | Valor |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

Use TTL padrao, como 1 hora.

## 2. WWW

Remova qualquer registro `www` atual que aponte para `@` ou `anaoliveirapsi.com.br`.

Crie este registro:

| Tipo | Nome | Valor |
| --- | --- | --- |
| CNAME | www | claudiovestevao.github.io |

Use TTL padrao, como 1 hora.

## 3. GitHub Pages

O repositorio ja contem o arquivo `CNAME` com:

```text
anaoliveirapsi.com.br
```

Depois que o DNS propagar, abra:

`https://github.com/claudiovestevao/anaoliveirapsi.com.br/settings/pages`

Confira se o campo "Custom domain" esta como:

```text
anaoliveirapsi.com.br
```

Quando o certificado ficar disponivel, marque "Enforce HTTPS".

## 4. Propagacao

Normalmente leva alguns minutos, mas pode levar ate 24 horas. Enquanto propaga, o site continua disponivel em:

`https://claudiocode.dev/anaoliveirapsi.com.br/`
