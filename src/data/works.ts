/**
 * 作品集数据 - 统一维护
 * 图片/视频路径可替换为腾讯云 COS / VOD 链接
 * 视频已全部使用阿里云 OSS 外链，不再依赖本地 public/videos/
 */

/* 视频路径 - 阿里云 OSS 外链 */
export const VIDEO_PATHS = {
  hero: "https://haixieling.oss-cn-shenzhen.aliyuncs.com/hero-showreel.mp4",
  zhongguohua: "https://haixieling.oss-cn-shenzhen.aliyuncs.com/creative%20short%20film.MP4",
  mianhuaShort: "https://haixieling.oss-cn-shenzhen.aliyuncs.com/project-02.mp4",
  dianmian: "https://haixieling.oss-cn-shenzhen.aliyuncs.com/dongman.mp4",
  yishourudan: "https://haixieling.oss-cn-shenzhen.aliyuncs.com/chengpian.MP4",
  project47: "https://haixieling.oss-cn-shenzhen.aliyuncs.com/kehuandapian.mp4",
} as const;

/* 项目 01 - 客厅/卧室 */
const PROJECT_01_BASE = "/projects/project-01";
export const SPACE_PROJECT_01 = {
  living: [
    `${PROJECT_01_BASE}/living-01.jpg`,
    `${PROJECT_01_BASE}/living-02.jpg`,
    `${PROJECT_01_BASE}/living-03.jpg`,
    `${PROJECT_01_BASE}/living-04.jpg`,
    `${PROJECT_01_BASE}/living-05.jpg`,
    `${PROJECT_01_BASE}/living-05%20(2).jpg`,
    `${PROJECT_01_BASE}/living-06.jpg`,
    `${PROJECT_01_BASE}/living-07.jpg`,
    `${PROJECT_01_BASE}/living-08.jpg`,
    `${PROJECT_01_BASE}/living-09.jpg`,
    `${PROJECT_01_BASE}/Corona%20Camera009_output.jpg`,
  ],
  bedroom: [
    `${PROJECT_01_BASE}/bedroom-01.jpg`,
    `${PROJECT_01_BASE}/bedroom-02.jpg`,
    `${PROJECT_01_BASE}/bedroom-03.jpg`,
    `${PROJECT_01_BASE}/bedroom-04.jpg`,
    `${PROJECT_01_BASE}/bedroom-05.jpg`,
  ],
};

/* 项目 02 - 住宅空间 A */
const PROJECT_02_BASE = "/projects/project-02";
export const SPACE_PROJECT_02 = {
  living: Array.from({ length: 15 }, (_, i) => `${PROJECT_02_BASE}/living-${String(i + 1).padStart(2, "0")}.jpg`),
  bedroom: Array.from({ length: 5 }, (_, i) => `${PROJECT_02_BASE}/bedroom-${String(i + 1).padStart(2, "0")}.jpg`),
};

/* 项目 03 - 住宅空间 B */
const PROJECT_03_BASE = "/projects/project-03";
export const SPACE_PROJECT_03 = {
  living: Array.from({ length: 12 }, (_, i) => `${PROJECT_03_BASE}/living-${String(i + 1).padStart(2, "0")}.jpg`),
  garden: Array.from({ length: 4 }, (_, i) => `${PROJECT_03_BASE}/garden-${String(i + 1).padStart(2, "0")}.jpg`),
};

/* 项目 04 - 商业空间 */
const PROJECT_04_BASE = "/projects/project-04";
export const SPACE_PROJECT_04 = Array.from(
  { length: 6 },
  (_, i) => `${PROJECT_04_BASE}/commercial-${String(i + 1).padStart(2, "0")}.jpg`
);

/* AIGC 项目 - project-05 设定图 1-23 */
export const AIGC_CONCEPT_05 = Array.from({ length: 23 }, (_, i) => ({
  src: `/projects/project-05/settings/${i + 1}.jpg`,
}));

/* project-06 缺失的图片索引（如 17.jpg 不存在则排除，避免 404） */
const PROJECT_06_MISSING = [17];
export const AIGC_CONCEPT_06 = Array.from({ length: 40 }, (_, i) => i + 1)
  .filter((n) => !PROJECT_06_MISSING.includes(n))
  .map((n) => ({
    src: `/projects/project-06/settings/${n}.jpg`,
    prompt: `项目二设定图 ${n}`,
  }));

export const AIGC_CONCEPT_07 = Array.from({ length: 10 }, (_, i) => ({
  src: `/projects/project-07/settings/${i + 1}.jpg`,
  prompt: `项目三设定图 ${i + 1}`,
}));

export const AIGC_CONCEPT_08 = Array.from({ length: 30 }, (_, i) => ({
  src: `/projects/project-08/settings/${i + 1}.jpg`,
  prompt: `项目四设定图 ${i + 1}`,
}));

export const AIGC_CONCEPT_09 = Array.from({ length: 6 }, (_, i) => ({
  src: `/projects/project-09/settings/${i + 1}.jpg`,
  prompt: `项目五设定图 ${i + 1}`,
}));

export interface ConceptImage {
  src: string;
  prompt?: string;
}
