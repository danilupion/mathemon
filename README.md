## Cloud

### Docker

#### Images creation

```bash
docker build -t mathemon/base -f Dockerfile  .
docker build -t mathemon/server -f apps/server/Dockerfile  .
docker build -t mathemon/web -f apps/client/Dockerfile  .
```

#### Debugging the images

##### Base

```bash
docker container run -it --rm mathemon/base /bin/sh
```

##### Server

```bash
docker container run -it --rm mathemon/server /bin/sh
```

##### Web

```bash
docker container run -it --rm mathemon/web /bin/sh
```

### Helm

#### Installing

##### Server

```bash
helm install -n mathemon --create-namespace mathemon-server ./apps/server/helm-chart
```

##### Web

```bash
helm install -n mathemon --create-namespace mathemon-web ./apps/web/helm-chart
```

#### Uninstalling

##### Server

```bash
helm uninstall -n mathemon --create-namespace mathemon-server
```

##### Web

```bash
helm uninstall -n mathemon --create-namespace mathemon-web ./apps/web/helm-chart
```

### Helmfile

Our setup works with environments, so assuming you created a values.yaml in the following path:

```
environments
  local
    values.yaml
```

#### Installation

```bash
helmfile apply -e local
```

#### Uninstalling

```bash
helmfile destroy -e local
```