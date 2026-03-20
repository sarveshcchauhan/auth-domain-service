If you want to **completely clean Docker (containers, images, networks, volumes, cache)** and free up disk space, here are safe and “wipe everything” commands.

---

# 🧹 1. Stop all running containers

```bash
docker stop $(docker ps -aq)
```

---

# 🗑️ 2. Remove all containers

```bash
docker rm $(docker ps -aq)
```

---

# 🖼️ 3. Remove all images

```bash
docker rmi -f $(docker images -aq)
```

---

# 🌐 4. Remove all networks (except default ones)

```bash
docker network prune -f
```

Or aggressive:

```bash
docker network rm $(docker network ls -q)
```

---

# 💾 5. Remove all volumes (⚠️ deletes database data)

```bash
docker volume rm $(docker volume ls -q)
```

Or safer:

```bash
docker volume prune -f
```

---

# 🧼 6. Remove everything in one command (BEST OPTION)

This is the cleanest full reset:

```bash
docker system prune -a --volumes -f
```

### What it removes:

* all stopped containers
* all unused images
* all unused networks
* all unused volumes
* build cache

---

# 🔥 7. Extra aggressive cleanup (rare use)

If Docker is still consuming space:

```bash
docker builder prune -a -f
```

---

# 📊 8. Check disk usage before/after

```bash
docker system df
```

---

# ⚠️ Important warnings (read this)

* `--volumes` will DELETE databases (MongoDB, Postgres data, etc.)
* `-a` removes **all images not used by containers**
* These actions are irreversible

---

# 💡 Recommended safe workflow

If you just want to free space (not destroy everything):

```bash
docker system prune -a
```

---

# 🚀 If Docker still takes space after cleanup

On Linux:

```bash
sudo systemctl restart docker
```

Or last resort:

```bash
sudo rm -rf /var/lib/docker
```

⚠️ Only do this if Docker is broken or you want a full reset.

---
