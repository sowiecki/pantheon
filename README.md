# Run at startup
Create `moirai.sh` with the following content:
```bash
#!/bin/sh
tmux new -d -s moirai 'cd path/to/moirai && npm start'
```

Create `~/.config/upstart/moirai.conf` with the following content:
```
start on startup
task
exec ~/startup/moirai.sh
```
