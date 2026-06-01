♻️ 环保数据管理系统 (Environmental Data Management System)
本项目为 新廊华小 (SJK (C) Ladang Grisek) 开发的环保数据录入与管理系统。该系统采用“离线优先”架构，旨在解决校园环境下的网络波动问题，确保数据录入的流畅性与可靠性。

🚀 核心特性 (Key Features)
离线优先 (Offline-First): 利用 localStorage 实现断网录入，数据自动存入队列，网络恢复后一键同步。

极致交互 (Continuous Entry): 支持流水线式数据录入，提交后保留上下文（如老师姓名），并具备自动重置与焦点捕获功能。

智能防呆 (Smart Validation): 基于前端内存数据库的实时匹配，输入学号瞬间自动填充姓名与班级，支持自动锁定与防篡改。

无服务器架构 (Serverless Architecture): 前端采用 React CDN 动态构建，后端基于 Google Apps Script，以 Google Sheets 作为轻量数据库，运维成本近乎为零。

双语支持 (Bilingual Support): 全界面支持中马双语，辅助说明文字随处可见，方便跨语言教师使用。

🛠️ 技术栈 (Tech Stack)
Frontend: React 18, Tailwind CSS, Chart.js (全 CDN 引入，无需编译).

Backend: Google Apps Script (GAS) 部署为 RESTful API。

Database: Google Sheets (底层数据存储)。

Storage: Browser localStorage (本地数据缓存、未同步队列、状态快照)。

📂 工程结构与机制 (Engineering Mechanisms)
数据流向: 启动时拉取 Sheet 数据 -> 用户录入 -> 写入本地内存与 localStorage -> 异步 fetch 提呈云端。

状态管理: 采用 React 状态管理，通过 useEffect 实时监听输入，利用 Array.find() 进行 O(N) 级别的高速匹配。

异常处理: 拦截 fetch 错误，即时转入离线模式并触发 unsynced_queue 逻辑，确保数据零丢失。

📝 录入模式 (Entry Modes)
单人模式 (Individu): 针对个体称重，提供自动防呆逻辑与连续累加功能。

批量模式 (Pukal): 网格化输入界面，支持草稿实时备份（防止页面刷新丢失数据）。

扣分模式 (Penalti): 包含浪费食物、浪费电源、其他违规三大类别，严格执行先审批后删除的操作审计（Audit）。

⚙️ 管理员操作 (Admin)
审核机制: 误录数据需提交申请，由管理员在“审核后台”批准后方可执行软删除，确保数据可追溯。

备份恢复: 支持一键 JSON 下载与恢复，保障系统年终重置与数据安全性。

📦 如何使用 (Usage)
访问: 通过公开链接访问系统首页。

录入: 登录管理员后台，选择对应模式即可开始工作。

同步: 顶部出现 🔄 未同步 时，说明存在离线记录，点击按钮即可完成云端同步。

管理: 使用“高级管理”功能进行学生名单导入、数据备份与操作审计。

“数据驱动环保，技术服务校园。”
SJK (C) Ladang Grisek, Jawatankuasa Pendidikan Kelestarian.
