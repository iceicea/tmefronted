<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useToast, POSITION } from "vue-toastification";
import VideoProcessModal from "./VideoProcessModal.vue";

const { platform, keyword } = defineProps<{
  platform: string;
  keyword: string;
}>();
const getRankClass = (rank: string) => {
  const map = {
    红色预警: "red",
    橙色预警: "orange",
    黄色预警: "yellow",
    蓝色预警: "blue",
    钻石级机会: "diamond",
    黄金级机会: "gold",
    白银级机会: "silver",
    青铜级机会: "bronze",
  };
  return map[rank] || "";
};

interface VideoData {
  id: number;
  title: string;
  author_name: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  summary: string;
  sentiment_score: number;
  video_url: string;
  asr_text: string;
  share_count: number;
  cover_url: string;
  platform: string;
  orRank?: string;
  poos_score?: number | null;
  pors_score?: number | null;
  track_type?: string;
  content?: string | null; // 新增内容字段
  // ... 其他字段
}

interface ApiResponse {
  platform: string;
  title: string;
  author_name: string;
  view_count?: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  summary: string;
  sentiment_score: number;
  video_url: string;
  asr_text: string;
  share_count: number;
  cover_url: string;
  id: number;
  orRank?: string;
  poos_score?: number | null;
  pors_score?: number | null;
  track_type?: string;
  content?: string | null; // 新增内容字段
}

const videoList = ref<VideoData[]>([]);

const toast = useToast();
const showModal = ref(false);
const modalType = ref<"counter" | "optimize" | "enhance">("counter");
const rankClassMap = {
  红色预警: "or-rank--red",
  橙色预警: "or-rank--orange",
  黄色预警: "or-rank--yellow",
  蓝色预警: "or-rank--blue",
  钻石级机会: "or-rank--diamond",
  黄金级机会: "or-rank--gold",
  白银级机会: "or-rank--silver",
  青铜级机会: "or-rank--bronze",
};
const fetchVideoList = async () => {
  try {
    const response = await fetch(`/api/monitor/${keyword}/latest`);
    const data = await response.json();
    console.log(`Received response: ${data}`);
    // const data = [
    //   {
    //     asr_text: "",
    //     author_id: "62576858000000001000d728",
    //     author_name: "\u5c0f\u9662",
    //     base_impact_score: 44.0,
    //     color_score: null,
    //     comment_count: 3,
    //     content: null,
    //     cover_url:
    //       "https://sns-na-i6.xhscdn.com/notes_pre_post/1040g3k031kefvc1gj2005oind1c41lp8v88792o?imageView2/2/w/540/format/jpg/q/75%7CimageMogr2/strip&redImage/frame/0&ap=5&sc=SRH_PRV&sign=dfc89fa6d9d75a4876b0cc6674e66e58&t=688af4e4",
    //     created_at: "2025-07-31T04:54:28.460682",
    //     description: null,
    //     final_bad_score: null,
    //     id: 6,
    //     images_url: null,
    //     ip_location: null,
    //     keyword: "Q\u97f3",
    //     like_count: 11,
    //     platform: "xiaohongshu",
    //     poos_score: null,
    //     pors_score: 20.0,
    //     propagation_score: -6.934287751760415,
    //     sentiment_score: -70.0,
    //     share_count: 3,
    //     summary:
    //       "\u5c0f\u7ea2\u4e66\u7528\u6237\u201c\u5c0f\u9662\u201d\u4e3a\u5341\u5e74QQ\u97f3\u4e50\u7528\u6237\uff0c\u66fe\u7ea2\u5fc35000\u4f59\u9996\u6b4c\u3001\u8d2d\u4e70\u5341\u51e0\u5f20\u6570\u5b57\u4e13\u8f91\uff0c\u6709\u957f\u671f\u4ed8\u8d39\u884c\u4e3a\uff0c\u4f46\u56e0\u201c\u514d\u8d39\u6362\u80cc\u666f\u201d\u529f\u80fd\u7f3a\u5931\u611f\u5230\u201c\u62e5\u6709\u611f\u662f\u5e7b\u89c9\u201d\uff0c\u8003\u8651\u505c\u7528\u3002\u914d\u56fe\u542b\u201c\u5341\u5e74Q\u97f3\uff0c\u8fd8\u662f\u62dc\u62dc\u5566\u201d\u6587\u5b57\u5f3a\u5316\u544a\u522b\u610f\u613f\uff0c\u9875\u9762\u540c\u65f6\u663e\u793aVIP\u7eed\u8d39\u63d0\u793a\uff0c\u51f8\u663e\u7528\u6237\u5bf9\u529f\u80fd\u4f53\u9a8c\u4e0e\u4ed8\u8d39\u4ef7\u503c\u7684\u4e0d\u6ee1\u3002",
    //     tags: [
    //       "\u5341\u5e74Q\u97f3\u7528\u6237",
    //       "\u4ed8\u8d39\u7528\u6237\u4e0d\u6ee1",
    //       "\u529f\u80fd\u4f53\u9a8c\u95ee\u9898",
    //       "\u7528\u6237\u6d41\u5931\u98ce\u9669",
    //       "\u505c\u7528\u8003\u8651",
    //     ],
    //     title:
    //       "\u5341\u5e74Q\u97f3\u7528\u6237\uff0c\u8fd8\u662f\u8003\u8651\u4e0d\u60f3\u7528\u4e86",
    //     topics: null,
    //     track_reason:
    //       "\u7528\u6237\u62b1\u6028\u975e\u6838\u5fc3\u529f\u80fd\uff08\u514d\u8d39\u6362\u80cc\u666f\uff09\u95ee\u9898\uff0c\u914d\u56fe\u65e0\u8d1f\u9762\u89c6\u89c9\u5143\u7d20\uff0c\u5c5e\u5c40\u90e8\u7528\u6237\u4f53\u9a8c\u4e0d\u6ee1",
    //     track_type: "risk",
    //     user_influence_score: -21.453650195120844,
    //     video_id: "",
    //     video_url: "",
    //     view_count: 0,
    //     voice_score: -35.46744296873263,
    //   },
    //   {
    //     asr_text:
    //       "Today\u5728\u7231today\u7231today\u7231you\u3002Hey, see anybody coming, you Young ger back. Tell you you with. ",
    //     author_id: "110688659935",
    //     author_name: "QQ\u97f3\u4e50",
    //     base_impact_score: 287.0,
    //     color_score: null,
    //     comment_count: 4,
    //     content: null,
    //     cover_url:
    //       "https://p3-pc-sign.douyinpic.com/tos-cn-i-dy/c906cced341249fd925fc5a7a528e3b0~tplv-dy-resize-origshort-autoq-75:330.jpeg?lk3s=138a59ce&x-expires=2069294400&x-signature=mr2Qj8N6lMWQ7LOciGj47eTAoQE%3D&from=327834062&s=PackSourceEnum_SEARCH&se=false&sc=cover&biz_tag=pcweb_cover&l=20250731124534EAC138EF4EE60D6C67FD",
    //     created_at: "2025-07-31T04:49:49.886217",
    //     description: null,
    //     final_bad_score: null,
    //     id: 1,
    //     images_url: null,
    //     ip_location: null,
    //     keyword: "Q\u97f3",
    //     like_count: 169,
    //     platform: "douyin",
    //     poos_score: 60.0,
    //     pors_score: null,
    //     propagation_score: 29.185788140565023,
    //     sentiment_score: 85.0,
    //     share_count: 10,
    //     summary:
    //       "QQ\u97f3\u4e50\u53d1\u5e03#q\u97f3\u73b0\u573a\u89c6\u9891\uff0c\u5185\u5bb9\u4e3a\u4e09\u4e2a\u5c0f\u7537\u5b69\u7a7f\u84dd\u8272\u897f\u88c5\u5728\u821e\u53f0\u4e0a\u53cd\u4e32\u6a21\u4eff\u6b27\u7f8e\u5929\u540e\u6f14\u5531\u300aBangBang\u300b\uff0c\u6807\u9898\u5f3a\u8c03\u201c\u5f00\u53e3\u9ad8\u97f3\u60ca\u547c\u201d\uff0c\u7a81\u51fa\u8868\u6f14\u7684\u60ca\u8273\u611f\uff0c\u5c55\u73b0\u9ad8\u5149\u97f3\u4e50\u73b0\u573a\u573a\u666f\u3002",
    //     tags: [
    //       "q\u97f3\u73b0\u573a",
    //       "\u53cd\u4e32\u6a21\u4eff",
    //       "BangBang",
    //       "\u9ad8\u5149\u97f3\u4e50\u73b0\u573a",
    //       "\u821e\u53f0\u8868\u6f14",
    //     ],
    //     title:
    //       "#q\u97f3\u73b0\u573a  \u4e09\u5c0f\u7537\u5b69\u53cd\u4e32\u6a21\u4eff\u6b27\u7f8e\u5929\u540e##BangBang \uff0c\u4ee5\u4e3a\u641e\u7b11\u7ed3\u679c\u5f00\u53e3\u9ad8\u97f3\u76f4\u63a5\u60ca\u547c#\u9ebb\u8fa3\u9e21 #JessieJ #ArianaGrande #\u70ed\u95e8#\u9ad8\u5149\u97f3\u4e50\u73b0\u573a",
    //     topics: null,
    //     track_reason:
    //       "\u5c01\u9762\u5c55\u73b0\u7537\u5b69\u821e\u53f0\u8868\u6f14\uff0c\u6709\u9ea6\u514b\u98ce\u7b49\u97f3\u4e50\u5143\u7d20\uff0c\u8868\u60c5\u6295\u5165\uff0c\u89c6\u89c9\u4e0e\u201c\u7075\u9b42\u8868\u6f14\u201d\u6587\u672c\u534f\u8c03\uff0c\u5c5e\u521b\u610f\u6a21\u4eff\u7834\u5708\u5b89\u5229",
    //     track_type: "opportunity",
    //     user_influence_score: 108.87312947844677,
    //     video_id: "7532794782234496308",
    //     video_url:
    //       "https://www.douyin.com/aweme/v1/play/?video_id=v0300fg10000d24tpnnog65qbp5v5nk0&line=0&file_id=7b478c99f52a4ca4b0425db4394f2541&sign=4ffc55d17bbdd28c9a5bbab273690c30&is_play_url=1&source=PackSourceEnum_SEARCH",
    //     view_count: null,
    //     voice_score: 267.76175675813005,
    //   },
    //   {
    //     asr_text:
    //       "\u5f80\u4e8b\u6d41\u8f6c\u5728\u4f60\u773c\u7738\u3002\u4e00\u8fb9\u9057\u5fd8\u4e00\u8fb9\u62fc\u51d1\u3002",
    //     author_id: "110688659935",
    //     author_name: "QQ\u97f3\u4e50",
    //     base_impact_score: 447.0,
    //     color_score: null,
    //     comment_count: 9,
    //     content: null,
    //     cover_url:
    //       "https://p3-pc-sign.douyinpic.com/tos-cn-i-dy/08cbbd9fd55c47a4bf6af9fc8941e3f9~tplv-dy-resize-origshort-autoq-75:330.jpeg?lk3s=138a59ce&x-expires=2069294400&x-signature=Gd2ie8c3Q6MTIWPSjNoF8l5ucRI%3D&from=327834062&s=PackSourceEnum_SEARCH&se=false&sc=cover&biz_tag=pcweb_cover&l=20250731124534EAC138EF4EE60D6C67FD",
    //     created_at: "2025-07-31T04:49:49.886223",
    //     description: null,
    //     final_bad_score: null,
    //     id: 2,
    //     images_url: null,
    //     ip_location: null,
    //     keyword: "Q\u97f3",
    //     like_count: 283,
    //     platform: "douyin",
    //     poos_score: 70.0,
    //     pors_score: null,
    //     propagation_score: 36.495209887062856,
    //     sentiment_score: 80.0,
    //     share_count: 4,
    //     summary:
    //       "QQ\u97f3\u4e50\u53d1\u5e03#q\u97f3\u73b0\u573a#\u5185\u5bb9\uff0c\u5448\u73b0\u5468\u6df1\u7eaf\u4eba\u58f0\u6d88\u97f3\u7248\u300a\u82e5\u68a6\u300b\u8868\u6f14\uff0c\u89c6\u9891\u542b\u6b4c\u8bcd\u201c\u5f80\u4e8b\u6d41\u8f6c\u5728\u4f60\u773c\u7738\u3002\u4e00\u8fb9\u9057\u5fd8\u4e00\u8fb9\u62fc\u51d1\u201d\uff0c\u5c01\u9762\u4e2d\u5468\u6df1\u8eab\u7740\u94f6\u7070\u5916\u5957\u624b\u6301\u84dd\u9ea6\u514b\u98ce\uff0c\u80cc\u666f\u6709\u7eff\u8272\u5149\u6548\uff0c\u7a81\u51fa\u201c\u65e0\u4eba\u751f\u8fd8\u7684be\u611f\u201d\uff0c\u5e76\u5173\u8054#\u590f\u65e5\u73af\u6e38\u8bb0#\u7b49\u6807\u7b7e\u3002",
    //     tags: [
    //       "q\u97f3\u73b0\u573a",
    //       "\u5468\u6df1",
    //       "\u7eaf\u4eba\u58f0\u300a\u82e5\u68a6\u300b",
    //       "be\u611f\u821e\u53f0",
    //       "\u590f\u65e5\u73af\u6e38\u8bb0",
    //     ],
    //     title:
    //       "#q\u97f3\u73b0\u573a#\u5468\u6df1  \u53bb\u4f34\u594f\u7684\u7eaf\u4eba\u58f0#\u82e5\u68a6  \uff0c\u6709\u4e00\u79cd\u65e0\u4eba\u751f\u8fd8\u7684be\u611f\n#\u590f\u65e5\u73af\u6e38\u8bb0  \n#\u6211\u7684\u975e\u51e1\u590f\u65e5\u65f6\u523b",
    //     topics: null,
    //     track_reason:
    //       "\u660e\u661f\u5468\u6df1\u5fae\u7b11\u6b63\u9762\u60c5\u7eea\uff0c\u624b\u6301\u9ea6\u514b\u98ce\u97f3\u4e50\u5143\u7d20\uff0c\u89c6\u89c9\u6587\u672c\u534f\u8c03\uff0c\u5c5e\u5173\u952e\u4eba\u7269\u80cc\u4e66\u9ad8\u4ef7\u503c\u5185\u5bb9",
    //     track_type: "opportunity",
    //     user_influence_score: 108.87312947844677,
    //     video_id: "7532804022718287144",
    //     video_url:
    //       "https://www.douyin.com/aweme/v1/play/?video_id=v0300fg10000d24uaivog65hoi43hjg0&line=0&file_id=932fa1e3c0d849e0a3b9d95f01597933&sign=c726941f7880c14bd7298ac7682b2c52&is_play_url=1&source=PackSourceEnum_SEARCH",
    //     view_count: null,
    //     voice_score: 288.65293450137915,
    //   },
    //   {
    //     asr_text:
    //       "\u628a\u4f60\u7684\u7075\u9b42\u5173\u5728\u6c38\u8fdc\u9501\u4e0a\u7684\u3002\u4f60\u4e0d\u662f\u771f\u6b63\u7684\u6211\u4e50\uff0c\u4f60\u7684\u624b\u603b\u4e0d\u80fd\u5b8c\u5168\u7684\u6108\u5408\uff0c\u6211\u7ad9\u5728\u4f60\u7684\u4fa7\uff0c\u5374\u50cf\u9694\u7740\u94f6\u6cb3\u3002\u5c31\u50cf\u4f60\u770b\u5230\u4e86\u8352\u5c71\uff0c\u4e3a\u4ec0\u4e48\u5931\u9009\u4e86\u8fd8\u8981\u88ab\u60e9\u7f5a\u5462\uff1f\u4e0d\u7ed3\u675f\u7684\u6b64\u523b\uff0c\u5fc3\u4e5f\u662f\u3002",
    //     author_id: "110688659935",
    //     author_name: "QQ\u97f3\u4e50",
    //     base_impact_score: 370.0,
    //     color_score: null,
    //     comment_count: 5,
    //     content: null,
    //     cover_url:
    //       "https://p3-pc-sign.douyinpic.com/tos-cn-i-dy/d2ea7966cc7e4a1dbb7b47be60127956~tplv-dy-resize-origshort-autoq-75:330.jpeg?lk3s=138a59ce&x-expires=2069294400&x-signature=t0pyXMvafa%2BVFs80DIz9Ainazr4%3D&from=327834062&s=PackSourceEnum_SEARCH&se=false&sc=cover&biz_tag=pcweb_cover&l=20250731124534EAC138EF4EE60D6C67FD",
    //     created_at: "2025-07-31T04:49:49.886224",
    //     description: null,
    //     final_bad_score: null,
    //     id: 3,
    //     images_url: null,
    //     ip_location: null,
    //     keyword: "Q\u97f3",
    //     like_count: 221,
    //     platform: "douyin",
    //     poos_score: 80.0,
    //     pors_score: null,
    //     propagation_score: 33.11619211035364,
    //     sentiment_score: 85.0,
    //     share_count: 11,
    //     summary:
    //       "QQ\u97f3\u4e50\u53d1\u5e03\u9093\u7d2b\u68cb22\u5c81\u53c2\u52a0\u300a\u6211\u662f\u6b4c\u624b\u300b\u534a\u51b3\u8d5b\u6f14\u5531\u300a\u4f60\u4e0d\u662f\u771f\u6b63\u7684\u5feb\u4e50\u300b\u7684\u9ad8\u5149\u73b0\u573a\u89c6\u9891\uff0c\u5c01\u9762\u5c55\u73b0\u5176\u624b\u6301\u9ea6\u514b\u98ce\u7684\u821e\u53f0\u9b45\u529b\uff0c\u670d\u88c5\u95ea\u4eae\uff0c\u80cc\u666f\u706f\u5149\u7eda\u4e3d\u3002\u89c6\u9891\u7a81\u51fa\u6b4c\u624b\u9ad8\u97f3\u8868\u73b0\u529b\u4e0e\u611f\u67d3\u529b\uff0c\u6587\u672c\u542b\u7ecf\u5178\u6b4c\u8bcd\u7247\u6bb5\uff0c\u6574\u4f53\u5448\u73b0\u4f18\u8d28\u97f3\u4e50\u73b0\u573a\u5185\u5bb9\u3002",
    //     tags: [
    //       "\u9093\u7d2b\u68cb \u6211\u662f\u6b4c\u624b",
    //       "\u4f60\u4e0d\u662f\u771f\u6b63\u7684\u5feb\u4e50 \u9ad8\u5149\u73b0\u573a",
    //       "QQ\u97f3\u4e50 \u7ecf\u5178\u821e\u53f0",
    //       "\u9ad8\u97f3\u70b8\u88c2 \u611f\u67d3\u529b",
    //     ],
    //     title:
    //       "#q\u97f3\u73b0\u573a#\u9093\u7d2b\u68cb  22\u5c81\u65f6\u7684#\u6211\u662f\u6b4c\u624b  \u534a\u51b3\u8d5b#\u4f60\u4e0d\u662f\u771f\u6b63\u7684\u5feb\u4e50  \u9ad8\u97f3\u70b8\u88c2\u611f\u67d3\u529b\u8d85\u5f3a#\u70ed\u95e8#\u6b4c\u624b #\u9ad8\u5149\u97f3\u4e50\u73b0\u573a",
    //     topics: null,
    //     track_reason:
    //       "\u5b98\u65b9\u53d1\u5e03\u9093\u7d2b\u68cb\u7ecf\u5178\u9ad8\u5149\u73b0\u573a\uff0c\u5c5e\u9ad8\u4ef7\u503c\u5185\u5bb9\uff0c\u5c01\u9762\u5fae\u7b11\u663e\u6b63\u9762\u60c5\u7eea\uff0c\u89c6\u89c9\u4e0e\u6587\u672c\u611f\u67d3\u529b\u5f3a",
    //     track_type: "opportunity",
    //     user_influence_score: 108.87312947844677,
    //     video_id: "7532469258740124962",
    //     video_url:
    //       "https://www.douyin.com/aweme/v1/play/?video_id=v0300fg10000d24b81nog65sk48vk1lg&line=0&file_id=701db4507d3c4890943372a3a4653b58&sign=2c7c2c37122296039be1c3e697e8e6a1&is_play_url=1&source=PackSourceEnum_SEARCH",
    //     view_count: null,
    //     voice_score: 279.7357783400619,
    //   },
    //   {
    //     asr_text: "",
    //     author_id: "62ab79b60000000019028197",
    //     author_name: "\u6771\u65e5",
    //     base_impact_score: 49.0,
    //     color_score: null,
    //     comment_count: 7,
    //     content: null,
    //     cover_url:
    //       "https://sns-na-i6.xhscdn.com/notes_pre_post/1040g3k831khbsctkia705olbf6r6d0cneqt9f2g?imageView2/2/w/540/format/jpg/q/75%7CimageMogr2/strip&redImage/frame/0&ap=5&sc=SRH_PRV&sign=40f84c54d41cf56d50fc77adf8cd7ea0&t=688af4e4",
    //     created_at: "2025-07-31T04:54:28.460672",
    //     description: null,
    //     final_bad_score: null,
    //     id: 4,
    //     images_url: null,
    //     ip_location: null,
    //     keyword: "Q\u97f3",
    //     like_count: 0,
    //     platform: "xiaohongshu",
    //     poos_score: 40.0,
    //     pors_score: null,
    //     propagation_score: -20.42156859950101,
    //     sentiment_score: 60.0,
    //     share_count: 0,
    //     summary:
    //       "\u7528\u6237\u5206\u4eab\u5728QQ\u97f3\u4e50\u76f4\u64ad\u7684\u4f53\u9a8c\uff0c\u63d0\u5230\u201c\u611f\u89c9\u8fd8\u53ef\u4ee5\u201d\uff0c\u914d\u56fe\u5c55\u793a\u76f4\u64ad\u7ed3\u675f\u6570\u636e\uff1a\u8fdb\u623f58\u4eba\uff0c\u65f6\u957f2\u5c0f\u65f617\u520631\u79d2\uff0c\u672c\u573a\u996d\u79682823\uff0c\u771f\u7231\u7c89\u4e1d1\u4eba\uff0c\u53e6\u67099\u4e2a\u4e3b\u64ad\u4efb\u52a1\u5956\u52b1\u672a\u9886\u53d6\u53ca\u76f4\u64ad\u5f55\u5236\u4fe1\u606f\uff0c\u6807\u7b7e\u6d89\u53ca\u97f3\u9891\u4e3b\u64ad\u3001\u4e2a\u64ad\u3001\u8bed\u97f3\u3002",
    //     tags: [
    //       "QQ\u97f3\u4e50\u76f4\u64ad",
    //       "\u97f3\u9891\u4e3b\u64ad",
    //       "\u4e2a\u64ad",
    //       "\u76f4\u64ad\u6570\u636e\u5206\u4eab",
    //       "\u8bed\u97f3\u76f4\u64ad",
    //     ],
    //     title:
    //       "\u8fd8\u6709\u6ca1\u6709\u4eba\u5728q\u97f3\u76f4\u64ad\u7684\u5440\uff0c\u611f\u89c9\u8fd8\u53ef\u4ee5",
    //     topics: null,
    //     track_reason:
    //       "\u6587\u672c\u4e3a\u6cdb\u5316\u79ef\u6781\u53cd\u9988\uff08\u201c\u611f\u89c9\u8fd8\u53ef\u4ee5\u201d\uff09\uff0c\u914d\u56fe\u4e3a\u76f4\u64ad\u6570\u636e\u754c\u9762\u622a\u56fe\uff0c\u65e0\u9ad8\u4ef7\u503cUGC\u6216\u6df1\u5ea6\u529f\u80fd\u8d5e\u626c\uff0c\u5c5e\u5e38\u89c4\u79ef\u6781\u53cd\u9988",
    //     track_type: "opportunity",
    //     user_influence_score: 13.426487748618769,
    //     video_id: "",
    //     video_url: "",
    //     view_count: 0,
    //     voice_score: 22.811199948488333,
    //   },
    //   {
    //     asr_text: "",
    //     author_id: "597e1ba45e87e7751215db00",
    //     author_name: "simgakhanei",
    //     base_impact_score: 27246.0,
    //     color_score: null,
    //     comment_count: 503,
    //     content: null,
    //     cover_url:
    //       "https://sns-na-i6.xhscdn.com/1040g2sg31bv37rhb107049n43odq9mo0rn22dto?imageView2/2/w/540/format/jpg/q/75%7CimageMogr2/strip&redImage/frame/0&ap=5&sc=SRH_PRV&sign=fef33eb5587521cab41f4fbe3bb7e8c3&t=688af4e4",
    //     created_at: "2025-07-31T04:54:28.460681",
    //     description: null,
    //     final_bad_score: null,
    //     id: 5,
    //     images_url: null,
    //     ip_location: null,
    //     keyword: "Q\u97f3",
    //     like_count: 8119,
    //     platform: "xiaohongshu",
    //     poos_score: 60.0,
    //     pors_score: null,
    //     propagation_score: 88.34604084052145,
    //     sentiment_score: 85.0,
    //     share_count: 347,
    //     summary:
    //       "\u7528\u6237\u5206\u4eabQQ\u97f3\u4e50\u81ea\u5b9a\u4e49\u64ad\u653e\u5668\u529f\u80fd\u4e0a\u7ebf\u7684\u5174\u594b\uff0c\u63d0\u5230\u5185\u6d4b\u672a\u8d76\u4e0a\u73b0\u7ec8\u4e8e\u53ef\u7528\uff0c\u914d\u56fe\u5c55\u793a6\u6b3e\u4e0d\u540c\u53ef\u7231\u5361\u901a\u98ce\u683c\u7684\u81ea\u5b9a\u4e49\u64ad\u653e\u5668\u754c\u9762\uff08\u542b\u6b4c\u66f2\u64ad\u653e\u4fe1\u606f\uff09\uff0c\u5e76\u9644\u6559\u7a0b\uff0c\u611f\u8c22\u6843\u5b50\u8001\u5e08\uff0c\u5e26\u76f8\u5173\u8bdd\u9898\u6807\u7b7e\u3002",
    //     tags: [
    //       "QQ\u97f3\u4e50\u81ea\u5b9a\u4e49\u64ad\u653e\u5668",
    //       "\u53ef\u7231\u76ae\u80a4",
    //       "\u529f\u80fd\u4e0a\u7ebf",
    //       "\u6559\u7a0b\u5206\u4eab",
    //       "\u5361\u901a\u98ce\u683c",
    //     ],
    //     title:
    //       "qq\u97f3\u4e50\u81ea\u5b9a\u4e49\u64ad\u653e\u5668 \u7ec8\u4e8e\u8f6e\u5230\u6211\u4e86\uff01\uff08\u9644\u6559\u7a0b",
    //     topics: null,
    //     track_reason:
    //       "\u914d\u56fe\u5c55\u793a\u591a\u79cd\u53ef\u7231\u5361\u901a\u4e3b\u9898\u64ad\u653e\u5668\uff0c\u8272\u5f69\u660e\u5feb\uff0c\u4e0e\u6587\u672c\u5174\u594b\u60c5\u7eea\u534f\u8c03\uff0c\u4f53\u73b0\u529f\u80fd\u521b\u610f\u7528\u6cd5",
    //     track_type: "opportunity",
    //     user_influence_score: 34.175141176478306,
    //     video_id: "",
    //     video_url: "",
    //     view_count: 0,
    //     voice_score: 151.57764245302639,
    //   },
    //   {
    //     asr_text: "",
    //     author_id: "63f8db16000000001001c9f9",
    //     author_name: "25\u53f7\u5e95\u7247a",
    //     base_impact_score: 2506.0,
    //     color_score: null,
    //     comment_count: 69,
    //     content: null,
    //     cover_url:
    //       "https://sns-na-i6.xhscdn.com/1040g2sg3165phquf1a005ovorcb43ifpi1qlpjo?imageView2/2/w/540/format/jpg/q/75%7CimageMogr2/strip&redImage/frame/0&ap=5&sc=SRH_PRV&sign=4893065798f961e5153db599ebc8432a&t=688af4e4",
    //     created_at: "2025-07-31T04:54:28.460683",
    //     description: null,
    //     final_bad_score: null,
    //     id: 7,
    //     images_url: null,
    //     ip_location: null,
    //     keyword: "Q\u97f3",
    //     like_count: 499,
    //     platform: "xiaohongshu",
    //     poos_score: 40.0,
    //     pors_score: null,
    //     propagation_score: 49.38173165809695,
    //     sentiment_score: 75.0,
    //     share_count: 123,
    //     summary:
    //       "\u7528\u6237\u5206\u4eab\u5728QQ\u97f3\u4e50\u627e\u5230\u514d\u8d39\u4f1a\u5458\u7684\u7ecf\u5386\uff0c\u79f0\u5176\u4e3a\u6253\u5de5\u4eba\u542c\u6b4c\u5c0f\u7a8d\u95e8\uff0c\u53ef\u542c\u514d\u8d39VIP\u6b4c\u66f2\uff0c\u914d\u56fe\u624b\u5199\u201cQQ\u97f3\u4e50\u514d\u8d39\u4f1a\u5458\u201d\u53ca\u201c\u7ec8\u4e8e\u88ab\u6211\u627e\u56de\u6765\u5566\u201d\uff0c\u6574\u4f53\u4f53\u73b0\u53d1\u73b0\u514d\u8d39\u798f\u5229\u7684\u559c\u60a6\u4e0e\u5b9e\u7528\u5206\u4eab\u3002",
    //     tags: [
    //       "QQ\u97f3\u4e50\u514d\u8d39\u4f1a\u5458",
    //       "\u6253\u5de5\u4eba\u542c\u6b4c\u653b\u7565",
    //       "\u514d\u8d39VIP\u6b4c\u66f2",
    //       "\u5b9e\u7528\u5c0f\u7a8d\u95e8",
    //       "\u7528\u6237\u798f\u5229\u5206\u4eab",
    //     ],
    //     title:
    //       "QQ\u97f3\u4e50\u4f60\u7684\u514d\u8d39\u4f1a\u5458\u85cf\u5f97\u597d\u6df1\u5440",
    //     topics: null,
    //     track_reason:
    //       "\u7528\u6237\u5206\u4eab\u514d\u8d39\u4f1a\u5458\u5b9e\u7528\u6280\u5de7\uff0c\u5c5e\u5e38\u89c4\u79ef\u6781\u53cd\u9988\uff1b\u914d\u56fe\u624b\u5199\u6587\u5b57\u8868\u8fbe\u5f00\u5fc3\uff0c\u89c6\u89c9\u4e0e\u6587\u672c\u534f\u8c03\uff0c\u4f20\u9012\u6b63\u9762\u60c5\u7eea",
    //     track_type: "opportunity",
    //     user_influence_score: 11.86267083212013,
    //     video_id: "",
    //     video_url: "",
    //     view_count: 0,
    //     voice_score: 40.323048971320866,
    //   },
    //   {
    //     asr_text: "",
    //     author_id: "638092d1000000001f01e90e",
    //     author_name: "\u4e91\u98ce\u4e4b\u5e06",
    //     base_impact_score: 324.0,
    //     color_score: null,
    //     comment_count: 12,
    //     content: null,
    //     cover_url:
    //       "https://sns-na-i6.xhscdn.com/notes_pre_post/1040g3k031k0k0pue34705os0ib8nrq8eou3tbo8?imageView2/2/w/540/format/jpg/q/75%7CimageMogr2/strip&redImage/frame/0&ap=5&sc=SRH_PRV&sign=827138ec10acebe8bd2e454f335f5655&t=688af4e4",
    //     created_at: "2025-07-31T04:54:28.460683",
    //     description: null,
    //     final_bad_score: null,
    //     id: 8,
    //     images_url: null,
    //     ip_location: null,
    //     keyword: "Q\u97f3",
    //     like_count: 198,
    //     platform: "xiaohongshu",
    //     poos_score: 40.0,
    //     pors_score: null,
    //     propagation_score: 31.42175513250629,
    //     sentiment_score: 80.0,
    //     share_count: 2,
    //     summary:
    //       "\u5c0f\u7ea2\u4e66\u7528\u6237\u201c\u4e91\u98ce\u4e4b\u5e06\u201d\u53d1\u5e03\u56fe\u6587\u7b14\u8bb0\uff0c\u5e86\u795d\u5468\u6df1\u6f14\u5531\u7684\u300a\u4e91\u88f3\u7fbd\u8863\u66f2\u300b\u5728QQ\u97f3\u4e50\uff08Q\u97f3\uff09\u6536\u85cf\u91cf\u7a81\u7834300\u4e07\uff0c\u63d0\u53ca\u4e0e\u817e\u8baf\u97f3\u4e50\u65d7\u4e0b\u53e6\u4e00\u5e73\u53f0\u9177\u72d7\u7834\u8bb0\u5f55\u65f6\u95f4\u4ec5\u5dee\u4e00\u5929\uff0c\u5e76\u914d\u56fe\u5c55\u793aQ\u97f3\u64ad\u653e\u754c\u9762\uff0c\u542b\u6b4c\u66f2\u9ed1\u80f6\u89c6\u89c9\u3001300W+\u6536\u85cf\u6807\u8bc6\u53caSQ/VIP\u97f3\u8d28\u4fe1\u606f\u3002",
    //     tags: [
    //       "\u4e91\u88f3\u7fbd\u8863\u66f2",
    //       "\u5468\u6df1\u6b4c\u66f2",
    //       "QQ\u97f3\u4e50\u6536\u85cf\u7834300\u4e07",
    //       "\u817e\u8baf\u97f3\u4e50\u65d7\u4e0b\u5e73\u53f0",
    //       "\u9ed1\u80f6\u64ad\u653e\u754c\u9762",
    //     ],
    //     title:
    //       "\u606d\u559c\u300a\u4e91\u88f3\u7fbd\u8863\u66f2\u300bQ\u97f3\u7834300W\u6536\u85cf",
    //     topics: null,
    //     track_reason:
    //       "\u914d\u56fe\u5c55\u793aQ\u97f3\u64ad\u653e\u754c\u9762\u53ca300W\u6536\u85cf\uff0c\u89c6\u89c9\u542b\u97f3\u4e50\u5143\u7d20\u4e0e\u5e86\u795d\u60c5\u7eea\uff0c\u6587\u672c\u4e3a\u5e73\u53f0\u6210\u7ee9\u79ef\u6781\u53cd\u9988\uff0c\u5c5e\u5e38\u89c4\u79ef\u6781\u53cd\u9988",
    //     track_type: "opportunity",
    //     user_influence_score: 9.078431327224607,
    //     video_id: "",
    //     video_url: "",
    //     view_count: 0,
    //     voice_score: 22.80396059464485,
    //   },
    //   {
    //     asr_text: "",
    //     author_id: "5bc9d711636c17000176b807",
    //     author_name: "Fiasco",
    //     base_impact_score: 3125.0,
    //     color_score: null,
    //     comment_count: 55,
    //     content: null,
    //     cover_url:
    //       "https://sns-na-i6.xhscdn.com/1040g008311tvbgsahm004bha7mbh3e079gdb820?imageView2/2/w/540/format/jpg/q/75%7CimageMogr2/strip&redImage/frame/0&ap=5&sc=SRH_PRV&sign=ed56a19ef12bd8e9b02a22524e3cdc5c&t=688af4e4",
    //     created_at: "2025-07-31T04:54:28.460684",
    //     description: null,
    //     final_bad_score: null,
    //     id: 9,
    //     images_url: null,
    //     ip_location: null,
    //     keyword: "Q\u97f3",
    //     like_count: 652,
    //     platform: "xiaohongshu",
    //     poos_score: 80.0,
    //     pors_score: null,
    //     propagation_score: 50.58655592525615,
    //     sentiment_score: 85.0,
    //     share_count: 41,
    //     summary:
    //       "\u7528\u6237\u5206\u4eab\u53c2\u52a0QQ\u97f3\u4e50\u60c5\u4fa3\u64ad\u653e\u5668\u6bd4\u8d5b\u7684\u4f5c\u54c1\u201c\u5fc3\u97f3\u00b7\u968f\u8eab\u542c\u201d\uff0c\u4ee5\u968f\u8eab\u542c\u4e3a\u4e3b\u4f53\u5143\u7d20\uff0c\u201c\u5fc3\u97f3\u201d\u8c61\u5f81\u60c5\u4fa3\u5fc3\u8df3\u4e0e\u60c5\u611f\u5171\u9e23\u3002\u914d\u56fe\u5448\u73b0\u7c89\u8272\u7cfb\u53ef\u7231\u98ce\u683c\uff0c\u542b\u78c1\u5e26\u9020\u578b\u968f\u8eab\u542c\u3001\u5154\u5b50\u8033\u673a\u3001\u7231\u5fc3\u88c5\u9970\u7b49\u5143\u7d20\uff0c\u4f20\u9012\u751c\u871c\u60c5\u611f\u8054\u7cfb\u3002",
    //     tags: [
    //       "Q\u97f3\u60c5\u4fa3\u64ad\u653e\u5668\u6bd4\u8d5b",
    //       "\u5fc3\u97f3\u968f\u8eab\u542c",
    //       "\u60c5\u4fa3\u60c5\u611f\u5171\u9e23",
    //       "\u590d\u53e4\u968f\u8eab\u542c",
    //       "\u7c89\u8272\u53ef\u7231\u98ce",
    //     ],
    //     title: "\u5fc3\u97f3\u00b7\u968f\u8eab\u542c",
    //     topics: null,
    //     track_reason:
    //       "\u7528\u6237\u81ea\u53d1\u521b\u4f5cQ\u97f3\u60c5\u4fa3\u4e3b\u9898UGC\uff0c\u89c6\u89c9\u7c89\u8272\u7cfb\u53ef\u7231\u5143\u7d20\u4f20\u9012\u6d6a\u6f2b\u60c5\u611f\uff0c\u56fe\u6587\u534f\u8c03\uff0c\u5c5e\u9ad8\u4ef7\u503c\u5185\u5bb9",
    //     track_type: "opportunity",
    //     user_influence_score: 29.371073965752103,
    //     video_id: "",
    //     video_url: "",
    //     view_count: 0,
    //     voice_score: 102.65157965553637,
    //   },
    //   {
    //     asr_text: "",
    //     author_id: "5bbca201995b0900014751dd",
    //     author_name: "\u516d\u516d\u7684\u9e8b\u9e7f",
    //     base_impact_score: 50.0,
    //     color_score: null,
    //     comment_count: 3,
    //     content: null,
    //     cover_url:
    //       "https://sns-na-i6.xhscdn.com/1040g2sg31k483vnpj0i04bcolrh02kethka16rg?imageView2/2/w/540/format/jpg/q/75%7CimageMogr2/strip&redImage/frame/0&ap=5&sc=SRH_PRV&sign=0d86f27d2c9d3931ed43a16de0873470&t=688af4e4",
    //     created_at: "2025-07-31T04:54:28.460684",
    //     description: null,
    //     final_bad_score: null,
    //     id: 10,
    //     images_url: null,
    //     ip_location: null,
    //     keyword: "Q\u97f3",
    //     like_count: 11,
    //     platform: "xiaohongshu",
    //     poos_score: 20.0,
    //     pors_score: null,
    //     propagation_score: -9.885518751261671,
    //     sentiment_score: 50.0,
    //     share_count: 0,
    //     summary:
    //       "\u5c0f\u7ea2\u4e66\u7528\u6237\u201c\u516d\u516d\u7684\u9e8b\u9e7f\u201d\u53d1\u5e03\u56fe\u6587\u7b14\u8bb0\uff0c\u5185\u5bb9\u805a\u7126\u65b0\u6b4c\u4e0a\u7ebf\u5728QQ\u97f3\u4e50\u7684\u63a8\u5e7f\u65b9\u6cd5\uff0c\u6b63\u6587\u5f15\u5bfc\u8bfb\u8005\u5173\u6ce8\uff0c\u914d\u56fe\u4e3a\u624b\u6301\u9ea6\u514b\u98ce\u7684\u5361\u901a\u4eba\u7269\u53ca\u201c\u5173\u4e8e\u65b0\u6b4c\u4e0a\u7ebf\uff0c\u5982\u4f55\u5728q\u97f3\u63a8\u201d\u6587\u5b57\uff0c\u6807\u7b7e\u6d89\u53ca#\u9648\u4e3d\u541b #\u65b0\u6b4c #\u6d41\u884c\u97f3\u4e50 \u7b49\uff0c\u65e8\u5728\u5206\u4eabQ\u97f3\u63a8\u5e7f\u7ecf\u9a8c\u3002",
    //     tags: [
    //       "QQ\u97f3\u4e50\u63a8\u5e7f",
    //       "\u65b0\u6b4c\u4e0a\u7ebf\u653b\u7565",
    //       "\u9648\u4e3d\u541b\u65b0\u6b4c",
    //       "\u5361\u901a\u97f3\u4e50\u4eba",
    //       "\u6d41\u884c\u97f3\u4e50\u5206\u4eab",
    //     ],
    //     title: "",
    //     topics: null,
    //     track_reason:
    //       "\u5185\u5bb9\u4e3a\u529f\u80fd\u8be2\u95ee\uff0c\u5c5e\u4e2d\u6027\u4e92\u52a8\u5206\u4eab\uff1b\u914d\u56fe\u5361\u901a\u4eba\u7269\u5e26\u5fae\u7b11\uff0c\u6709\u6b63\u9762\u60c5\u7eea\uff0c\u89c6\u89c9\u4e0e\u6587\u672c\u56f4\u7ed5Q\u97f3\u63a8\u5e7f\u4e3b\u9898\uff0c\u534f\u8c03\u6027\u4e00\u822c",
    //     track_type: "opportunity",
    //     user_influence_score: 4.844170261948243,
    //     video_id: "",
    //     video_url: "",
    //     view_count: 0,
    //     voice_score: 8.271760667243347,
    //   },
    // ];
    console.log("获取到的视频数据:", data);
    if (Array.isArray(data)) {
      // 过滤指定平台的数据
      // const platformData = data.filter(
      //   (item: ApiResponse) =>
      //     item.platform.toLowerCase() ===
      //     (platform === "抖音" ? "douyin" : platform).toLowerCase()
      // );
      const platformData = data.map((x) => x);
      // 转换数据格式以匹配后端返回的字段
      videoList.value = platformData.map((item: ApiResponse) => {
        let orRank = "";
        if (item.track_type === "opportunity") {
          if (item.poos_score > 75) {
            orRank = "钻石级机会";
          } else if (item.poos_score > 50) {
            orRank = "黄金级机会";
          } else if (item.poos_score > 30) {
            orRank = "白银级机会";
          } else {
            orRank = "青铜级机会";
          }
        }
        if (item.track_type === "risk") {
          if (item.pors_score > 75) {
            orRank = "红色预警";
          } else if (item.pors_score > 50) {
            orRank = "橙色预警";
          } else if (item.pors_score > 30) {
            orRank = "黄色预警";
          } else {
            orRank = "蓝色预警";
          }
        }
        if (item.summary.length >= 35) {
          item.summary = item.summary.slice(0, 35) + "...";
        }
        if (!item.title) item.title = item.content + "";
        if (item.title.length >= 35) {
          item.title = item.title.slice(0, 35) + "...";
        }
        return {
          id: item.id,
          title: item.title,
          author_name: item.author_name,
          view_count: item.view_count || 0,
          like_count: item.like_count,
          comment_count: item.comment_count,
          created_at: new Date(item.created_at).toLocaleDateString("zh-CN"),
          summary: item.summary,
          sentiment_score: item.sentiment_score,
          video_url: item.video_url,
          asr_text: item.asr_text,
          share_count: item.share_count,
          cover_url: item.cover_url,
          platform: item.platform,
          orRank: orRank,
          poos_score: item.poos_score,
          pors_score: item.pors_score,
          track_type: item.track_type,
        };
      });
    }
  } catch (error) {
    console.error("获取视频列表失败:", error);
  }
};
// console.log(videoList.value)

// 在组件挂载时获取数据
onMounted(() => {
  fetchVideoList();
});

// 添加对 keyword 的监听
watch(
  () => keyword,
  (_) => {
    fetchVideoList(); // 当关键词变化时重新获取数据
  }
);

const getSentimentColor = (sentiment: number) => {
  if (sentiment > 30) return "positive";
  if (sentiment < -30) return "negative";
  return "neutral";
};

const getSentimentLabel = (sentiment: number): "正面" | "中立" | "负面" => {
  if (sentiment > 30) return "正面";
  if (sentiment < -30) return "负面";
  return "中立";
};

const formatNumber = (num: number) => {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + "亿";
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  }
  return num.toLocaleString();
};

const handleCounterVideo = (_video: VideoData) => {
  modalType.value = "counter";
  showModal.value = true;
};

const handleOptimizeVideo = (_video: VideoData) => {
  modalType.value = "optimize";
  showModal.value = true;
};

const handleEnhanceVideo = (_video: VideoData) => {
  modalType.value = "enhance";
  showModal.value = true;
};

const handlePipelineRequest = () => {
  toast.info("已向管理员提交视频渲染管线申请，请等待审核通过", {
    timeout: 3000,
    position: POSITION.TOP_RIGHT,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: true,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
  });
  showModal.value = false;
};
</script>

<template>
  <div class="video-list-card">
    <h3 class="list-title">#{{ keyword }} 各平台相关内容</h3>

    <!-- <div class="info-tooltips">
      <div class="tooltip-item">
        <div class="tooltip-icon">🤖</div>
        <div class="tooltip-content">
          <h4>视频内容AI总结</h4>
          <p>通过多模态大模型分析视频内容：</p>
          <ul>
            <li>智能识别视频画面重点内容</li>
            <li>语音转文字处理视频语音</li>
            <li>提取关键观点和论述</li>
            <li>生成简洁精准的内容摘要</li>
          </ul>
        </div>
      </div>
      <div class="tooltip-item">
        <div class="tooltip-icon">📈</div>
        <div class="tooltip-content">
          <h4>博主情感分析</h4>
          <p>
            通过深度学习模型分析视频内容、字幕和评论，得出博主对话题的情感倾向：
          </p>
          <ul>
            <li>
              <div class="sentiment-range">
                <span class="tag-positive">正面</span>
                <span class="range-text">情感分数 > 30</span>
              </div>
            </li>
            <li>
              <div class="sentiment-range">
                <span class="tag-neutral">中立</span>
                <span class="range-text">-30 ≤ 情感分数 ≤ 30</span>
              </div>
            </li>
            <li>
              <div class="sentiment-range">
                <span class="tag-negative">负面</span>
                <span class="range-text">情感分数 < -30</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="tooltip-item">
        <div class="tooltip-icon">🎯</div>
        <div class="tooltip-content">
          <h4>舆论反制视频（预览版）</h4>
          <p>系统会针对负面视频自动生成反制内容：</p>
          <ul>
            <li>智能剪辑正面素材</li>
            <li>生成有力反驳论据</li>
            <li>优化传播效果</li>
            <li>后续会接入NIO域知识库</li>
          </ul>
        </div>
      </div>
    </div> -->

    <table>
      <thead>
        <tr>
          <th style="width: 10%">视频/笔记封面</th>
          <th style="width: 20%">视频/笔记信息</th>
          <th style="width: 10%">数据分析</th>
          <th style="width: 20%">内容摘要</th>
          <th style="width: 10%">情感分析</th>
          <th style="width: 10%">风险/机会分</th>
          <th style="width: 10%">风险/机会等级</th>
          <th style="width: 10%">事件详情</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="video in videoList" :key="video.id">
          <td class="video-cover" @click="$router.push({ name: 'RiskBoard' })">
            <img
              :src="video.cover_url"
              :alt="video.title"
              class="cover-image"
            />
          </td>
          <td class="video-info">
            <div
              class="video-title"
              @click="$router.push({ name: 'RiskBoard' })"
            >
              {{ video.title }}
            </div>
            <div class="video-meta">
              <span class="author"
                >@{{
                  video.platform === "douyin"
                    ? "抖音"
                    : video.platform === "xiaohongshu"
                    ? "小红书"
                    : video.platform === "weibo"
                    ? "微博"
                    : "其他平台"
                }}</span
              >
              <span class="date">{{ video.created_at }}</span>
            </div>
          </td>
          <td class="video-stats">
            <div class="stat-group">
              <div class="stat-item">
                <span class="stat-number">{{
                  formatNumber(video.like_count)
                }}</span>
                <span class="stat-label">点赞</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{
                  formatNumber(video.comment_count)
                }}</span>
                <span class="stat-label">评论</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">{{
                  video.platform === "xiaohongshu"
                    ? "-"
                    : formatNumber(video.share_count)
                }}</span>
                <span class="stat-label">分享</span>
              </div>
            </div>
          </td>
          <td class="video-summary">{{ video.summary }}</td>
          <td class="sentiment-analysis">
            <div
              class="sentiment-score"
              :class="getSentimentColor(video.sentiment_score)"
            >
              {{ video.sentiment_score > 0 ? "+" : ""
              }}{{ video.sentiment_score }}
            </div>
            <div
              class="sentiment-badge"
              :class="getSentimentColor(video.sentiment_score)"
            >
              {{ getSentimentLabel(video.sentiment_score) }}
            </div>
          </td>
          <td class="or-score">{{ video.poos_score || video.pors_score }}</td>
          <td class="or-rank" :class="`or-rank--${getRankClass(video.orRank)}`">
            {{ video.orRank }}
          </td>
          <td class="counter-video">
            <!-- <button

             
              v-if="video.sentiment_score < -30"
              class="counter-btn negative"
              @click="handleCounterVideo(video)"
            >
              <span class="btn-text">生成反制</span>
            </button>
            <button
              v-else-if="video.sentiment_score < 0"
              class="counter-btn neutral"
              @click="handleOptimizeVideo(video)"
            >
              <span class="btn-text">优化建议</span>
            </button>
            <button
              v-else
              class="counter-btn positive"
              @click="handleEnhanceVideo(video)"
            >
              <span class="btn-text">传播加强</span>
            </button> -->
            <div class="action-section">
              <button
                class="detail-btn"
                @click="$router.push({ name: 'RiskBoard' })"
              >
                查看详情
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <VideoProcessModal
      :show="showModal"
      :type="modalType"
      @close="showModal = false"
      @request-pipeline="handlePipelineRequest"
    />
  </div>
</template>

<style scoped>
.video-list-card {
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
}

th {
  text-align: center;
  padding: 12px;
  border-bottom: 1px solid #333;
  color: #888;
  font-weight: normal;
}

td {
  text-align: center;
  padding: 16px 12px;
  border-bottom: 1px solid #222;
  vertical-align: middle;
}

.video-cover {
  width: 120px;
}

.cover-image {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  object-fit: cover;
}

.video-title {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-meta {
  margin-top: 8px;
  font-size: 0.9em;
  color: #666;
}

.video-stats {
  padding: 16px 0;
  height: 100%;
}

.stat-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.stat-number {
  color: #fff;
  font-weight: 500;
  min-width: 50px;
  text-align: right;
}

.stat-label {
  color: #666;
  font-size: 0.9em;
  min-width: 30px;
}

.video-summary {
  font-size: 0.9em;
  line-height: 1.5;
  color: #bbb;
  display: -webkit-box; /* 启用多行截断 */
  -webkit-line-clamp: 3; /* 限制为 2 行（可根据需求调整） */
  -webkit-box-orient: vertical; /* 垂直方向排列 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 用...替代超出部分 */
  max-width: 30ch; /* 限制宽度为 30 个中文字符 */
}

.sentiment-analysis {
  text-align: left;
}

.sentiment-score,
.or-score {
  font-size: 24px;
  font-weight: 600;
  font-family: "Monaco", "Menlo", monospace;
  margin-bottom: 8px;
  text-align: center;
  color: #fff;
}
.or-rank {
  font-size: 16px;
  font-weight: 500;
  font-family: "Monaco", "Menlo", monospace;
  text-align: center;
}
.or-rank--red {
  color: #ff0000;
} /* 红色预警 */
.or-rank--orange {
  color: #ffa500;
} /* 橙色预警 */
.or-rank--yellow {
  color: #ffff00;
} /* 黄色预警 */
.or-rank--blue {
  color: #4b86df;
} /* 蓝色预警 */

/* 机会级别颜色 */
.or-rank--diamond {
  color: #00bfff;
} /* 钻石级机会（浅蓝） */
.or-rank--gold {
  color: #ffd700;
} /* 黄金级机会（金黄） */
.or-rank--silver {
  color: #c0c0c0;
} /* 白银级机会（银白） */
.or-rank--bronze {
  color: #cd7f32;
}
.sentiment-score.positive {
  color: #1ce783;
}

.sentiment-score.negative {
  color: #ff4d4d;
}

.sentiment-score.neutral {
  color: #888;
}

.sentiment-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9em;
  margin-bottom: 6px;
  text-align: center;
}

.sentiment-badge.positive {
  background: rgba(0, 255, 0, 0.1);
  color: #4caf50;
}

.sentiment-badge.negative {
  background: rgba(255, 0, 0, 0.1);
  color: #f44336;
}

.sentiment-badge.neutral {
  background: rgba(255, 255, 255, 0.1);
  color: #888;
}

.counter-btn {
  position: relative;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  font-weight: 500;
  letter-spacing: 0.5px;
  width: 100%;
  background: transparent;
  overflow: hidden;
  transition: all 0.3s ease;
}

.counter-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.05)
  );
  border-radius: 4px;
  z-index: 1;
}

.counter-btn::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transform: rotate(45deg);
  transition: all 0.6s ease;
  z-index: 2;
}

.btn-text {
  position: relative;
  z-index: 3;
}

.counter-btn.negative {
  background: linear-gradient(135deg, #ff4444 0%, #aa1111 100%);
  box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
  border: 1px solid rgba(255, 68, 68, 0.3);
}

.counter-btn.neutral {
  background: linear-gradient(135deg, #666666 0%, #333333 100%);
  box-shadow: 0 0 20px rgba(102, 102, 102, 0.3);
  border: 1px solid rgba(102, 102, 102, 0.3);
}

.counter-btn.positive {
  background: linear-gradient(135deg, #40c057 0%, #2b7a39 100%);
  box-shadow: 0 0 20px rgba(64, 192, 87, 0.3);
  border: 1px solid rgba(64, 192, 87, 0.3);
}

.counter-btn:hover {
  transform: translateY(-2px);
}

.counter-btn:hover::after {
  top: -100%;
  left: -100%;
}

.counter-btn.negative:hover {
  box-shadow: 0 0 30px rgba(255, 68, 68, 0.5);
}

.counter-btn.neutral:hover {
  box-shadow: 0 0 30px rgba(102, 102, 102, 0.5);
}

.counter-btn.positive:hover {
  box-shadow: 0 0 30px rgba(64, 192, 87, 0.5);
}

/* 添加按钮文字样式 */
.btn-text {
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.info-tooltips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.tooltip-item {
  display: flex;
  gap: 1rem;
  max-width: 400px;
}

.tooltip-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.tooltip-content {
  flex: 1;
}

.tooltip-content h4 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
  font-size: 1rem;
}

.tooltip-content p {
  margin: 0 0 0.5rem 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
}

.tooltip-content ul {
  margin: 0;
  padding-left: 1.2rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.8;
}

.tooltip-content li {
  margin: 0.4rem 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.tooltip-content .tag-positive,
.tooltip-content .tag-neutral,
.tooltip-content .tag-negative {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9em;
  margin-right: 8px;
}

.tooltip-content .tag-positive {
  background: rgba(64, 192, 87, 0.1);
  color: #40c057;
  border: 1px solid rgba(64, 192, 87, 0.2);
}

.tooltip-content .tag-neutral {
  background: rgba(255, 255, 255, 0.1);
  color: #888;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tooltip-content .tag-negative {
  background: rgba(255, 68, 68, 0.1);
  color: #ff4444;
  border: 1px solid rgba(255, 68, 68, 0.2);
}

/* 悬停效果 */
.stat-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.stat-item:hover .stat-number {
  color: #fff;
  transform: scale(1.05);
}

.stat-item:hover .stat-label {
  color: #888;
}
.detail-btn {
  padding: 8px 16px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.detail-btn:hover {
  background-color: #1565c0;
}

.detail-btn:active {
  background-color: #0d47a1;
}
</style>
