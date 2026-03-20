# Feature Request Pipeline Process

## 1) Mục tiêu

Tài liệu này định nghĩa quy trình chuẩn khi nhận request tạo **feature mới** trong project `go-tool`, để đảm bảo:

- Scope rõ ràng
- Code đúng convention
- Chất lượng ổn định
- Quy trình release nhất quán (PR -> merge -> deploy verify)

## 2) Khi nào áp dụng

Áp dụng cho mọi request có tạo mới hoặc mở rộng đáng kể một feature, bao gồm:

- New page/tool
- New flow trong feature hiện tại
- Thay đổi behavior/UX quan trọng

## 3) Pipeline tổng quát (End-to-End)

1. Tiếp nhận request và chốt scope
2. Phân rã task + plan thực thi
3. Tạo branch riêng từ `main`
4. Implement theo feature-first architecture
5. Cập nhật docs cho feature
6. Chạy quality gates (lint/typecheck/build)
7. Commit + push + tạo PR
8. Merge vào `main`
9. Verify deploy (Vercel) thành công
10. Kết thúc task

## 4) Chi tiết từng bước

### Step 1 - Tiếp nhận request

- Xác định rõ:
  - Feature cần làm
  - In-scope / Out-of-scope
  - Expected UX/behavior
- Nếu có ambiguity ảnh hưởng solution, làm rõ sớm.
- Nếu không blocked, proceed luôn với assumption hợp lý.

### Step 2 - Planning

- Viết plan ngắn gọn:
  - Problem
  - Approach
  - Danh sách tasks
- Ưu tiên task order có dependency rõ ràng.

### Step 3 - Branching

- Tạo branch từ `main`:

```bash
git checkout main
git pull
git checkout -b feat/<short-topic>
```

- Quy ước:
  - `feat/<topic>` cho feature
  - `fix/<topic>` cho bug
  - `docs/<topic>` cho documentation

### Step 4 - Implementation

- Theo structure feature-first:
  - `src/features/<feature>/...`
- Ưu tiên Ant Design components cho UI.
- Tái sử dụng shared components/hooks trước khi tạo mới.
- Update route/menu nếu feature có page mới.
- Export public API qua `src/features/<feature>/index.ts`.

### Step 5 - Documentation

- Tạo/cập nhật:
  - `src/features/<feature>/README.md`
- Tối thiểu gồm:
  - Purpose
  - User flow
  - Key technical notes

### Step 6 - Quality Gates

Chạy đầy đủ:

```bash
pnpm lint --quiet
pnpm typecheck
pnpm build
```

- Chỉ tiếp tục khi pass.
- Không merge khi còn lỗi lint/type/build.

### Step 7 - Commit + PR

- Commit theo Conventional Commits:

```text
feat(scope): short summary
```

- Push branch và tạo PR vào `main`.
- PR description nên có:
  - Summary thay đổi
  - Validation commands đã chạy
  - Ảnh hưởng behavior (nếu có)

### Step 8 - Merge

- Merge sau khi checks ổn định.
- Ưu tiên squash merge để lịch sử gọn.

### Step 9 - Deployment Verification (Bắt buộc)

- Sau merge, verify deployment cho commit mới nhất.
- Với repo này: kiểm tra **Vercel status = success**.
- Chỉ đóng task khi deploy đã thành công.

## 5) Definition of Done (Feature Request)

Task chỉ được xem là done khi đủ tất cả:

- Scope hoàn thành đúng request
- Code đúng convention của project
- Feature docs được cập nhật
- `pnpm lint --quiet` pass
- `pnpm typecheck` pass
- `pnpm build` pass
- PR đã merge vào `main`
- Vercel deployment verified thành công

## 6) Quick Checklist (Copy/Paste)

```text
[ ] Scope confirmed
[ ] Plan created
[ ] Branch created from main
[ ] Feature implemented
[ ] Feature README updated
[ ] lint pass
[ ] typecheck pass
[ ] build pass
[ ] PR created
[ ] PR merged
[ ] Vercel deployment success
```

## 7) Notes for this repository

- UI preference: ưu tiên Ant Design components.
- Trạng thái global dùng Zustand; state local giữ ở component/page.
- Không duplicate logic nếu đã có shared helper.
