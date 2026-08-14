#!/usr/bin/env bash
#
# Deploy lên VPS chạy trực tiếp (không Docker).
#
#   ssh deploy@server
#   cd /var/www/congcu && ./scripts/deploy-vps.sh
#
# Ghi đè mặc định bằng biến môi trường:
#   APP_DIR=/srv/app SERVICE=my-app ./scripts/deploy-vps.sh

# -e dừng ngay khi có lệnh lỗi, -u báo lỗi khi dùng biến chưa khai báo,
# pipefail để lỗi giữa pipe không bị nuốt. Thiếu ba cờ này thì script deploy
# vẫn báo "thành công" dù bước migrate đã chết.
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/congcu}"
SERVICE="${SERVICE:-congcu}"
ENV_FILE="${ENV_FILE:-/etc/congcu/env}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1:3000/}"

step() { printf '\n\033[1;34m▸ %s\033[0m\n' "$1"; }
fail() { printf '\n\033[1;31m✗ %s\033[0m\n' "$1" >&2; exit 1; }

cd "$APP_DIR" || fail "Không vào được $APP_DIR"

# Nạp biến môi trường. Bước này bắt buộc vì `next build` nhúng các biến
# NEXT_PUBLIC_* thẳng vào bundle, mà file env nằm ngoài thư mục mã nguồn
# (xem deploy/congcu.service).
if [ -f "$ENV_FILE" ]; then
	step "Nạp biến môi trường từ $ENV_FILE"
	set -a
	# shellcheck disable=SC1090
	. "$ENV_FILE"
	set +a
else
	fail "Không tìm thấy $ENV_FILE"
fi

step "Lấy mã nguồn mới nhất"
# --ff-only: nếu lịch sử đã rẽ nhánh thì dừng lại, đừng tự merge trên
# production rồi để lại một commit không ai review.
git pull --ff-only

step "Cài dependencies"
corepack enable
# KHÔNG dùng --prod: bước build cần devDependencies (next, typescript).
pnpm install --frozen-lockfile

step "Build"
# Site không có database nên không có bước migration nào ở đây: build xong ra
# HTML tĩnh, khởi động lại service là xong.
pnpm build

step "Khởi động lại service"
sudo systemctl restart "$SERVICE"

step "Kiểm tra sức khoẻ"
for attempt in $(seq 1 30); do
	if curl -fsS "$HEALTH_URL" >/dev/null 2>&1; then
		printf '\n\033[1;32m✓ Deploy xong. Service đang khoẻ.\033[0m\n'
		curl -s "$HEALTH_URL"
		echo
		exit 0
	fi
	sleep 2
	printf '  chờ... (%s/30)\n' "$attempt"
done

# Không im lặng bỏ qua: service không lên được là deploy thất bại.
printf '\n\033[1;31m✗ Service không phản hồi sau 60 giây.\033[0m\n' >&2
journalctl -u "$SERVICE" -n 40 --no-pager >&2 || true
exit 1
