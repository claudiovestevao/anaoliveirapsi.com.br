# DNS para publicar anaoliveirapsi.com.br

O site já está publicado no GitHub Pages. Para usar o domínio `anaoliveirapsi.com.br`, configure estes registros no DNS da GoDaddy:

## Domínio raiz

Tipo: `A`

Nome: `@`

Valores:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Remova os registros `A` atuais que apontam para:

```text
13.248.243.5
76.223.105.230
```

## WWW

Tipo: `CNAME`

Nome: `www`

Valor:

```text
claudiocode.dev
```

Depois que esses DNS propagarem, o GitHub Pages pode ser configurado novamente com o domínio customizado `anaoliveirapsi.com.br` e HTTPS obrigatório.
