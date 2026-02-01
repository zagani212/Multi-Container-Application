# Multi-Container Application

Project URL : https://roadmap.sh/projects/multi-container-service

A containerized Node.js + MongoDB API fronted by Nginx, with infrastructure provisioned via Terraform, host configuration via Ansible, and CI/CD via GitHub Actions.

## Project structure

```
.github/workflows/          # CI/CD pipeline
ansible/                    # Docker installation on target host
app/                        # Application + Docker Compose + Nginx config
  compose.yml               # Services: api, mongo, nginx
  Dockerfile                # Node.js API image
  index.js                  # Express + MongoDB CRUD API
  nginx.conf                # Reverse proxy to api
  database/db.js            # Mongoose model
keys/                       # SSH keys used by Terraform/Ansible
terraform/                  # AWS infrastructure
  network/                  # VPC, subnet, routes
  security/                 # Security group rules
```

## How it works

### Runtime architecture

- **Nginx** listens on port 80 and proxies all requests to the API container.
- **API (Node.js/Express)** exposes CRUD endpoints for todos on port 3000.
- **MongoDB** stores todos and persists data via a Docker volume.

### Docker Compose flow

The compose file spins up three services:
- `api` (prebuilt image from Docker Hub)
- `mongo` (official MongoDB image)
- `nginx` (official Nginx image with mounted config)

### API endpoints

- `GET /` — greeting
- `GET /todos` — list todos
- `POST /todos` — create todo
- `GET /todos/:id` — get a todo
- `PUT /todos/:id` — update a todo
- `DELETE /todos/:id` — delete a todo

## Infrastructure

### Terraform (AWS)

- **VPC + subnet + route table** in `terraform/network/`.
- **Security group** in `terraform/security/` allowing SSH (22), HTTP (80), and API (3000).
- **EC2 instance** provisioned in `terraform/main.tf` using a provided AMI and instance type.
- **Key pair** created from `keys/key.pub`.

### Ansible

The playbook in `ansible/playbook.yml` installs Docker and Docker Compose on the EC2 instance, enables the Docker service, and adds the SSH user to the docker group.

## CI/CD (GitHub Actions)

Pipeline in `.github/workflows/github_actions.yml`:

1. **Detect changes** in `ansible/` and `app/`.
2. **Run Ansible** if `ansible/` changes.
3. **Build & push** API image to Docker Hub if `app/` changes.
4. **Deploy** by copying `compose.yml` and `nginx.conf` to the EC2 host and running `docker-compose up -d` over SSH.

## Local usage

### Prerequisites

- Docker + Docker Compose

### Run locally

```bash
cd app
docker-compose up -d
```

Access:
- API via Nginx: `http://localhost/`
- Direct API: `http://localhost:3000/todos`

## Deployment workflow

1. **Provision infrastructure** with Terraform in `terraform/`.
2. **Install Docker** using Ansible in `ansible/`.
3. **Push changes** to GitHub to trigger CI/CD.

## Notes

- The API connects to MongoDB using the service name `mongo` inside the Docker network.
- The API image is expected to exist in Docker Hub under the configured user name.
