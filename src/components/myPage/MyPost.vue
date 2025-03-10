<script setup lang="ts">
import MyTravelCard from '@/components/myPage/MyTravelCard.vue';
import AdoptionRequestDisplay, {
  type AdoptionRequestData,
} from '@/components/myPage/AdoptionRequestDisplay.vue';
import { onMounted, ref, watch } from 'vue';

import { getChannelPosts } from '@/apis/devcourse/Post/getChannelPosts';
import type adoptionForm from '@/types/adoptionForm';
import * as CHANID from '@/constants/communityConsts';
import { useAuthStore } from '@/stores/auth';
import type { devPost } from '@/types/devcourse/devPost';

import { getAuthorPosts } from '@/apis/devcourse/Post/getAuthorPosts';

const adoptionFormPost = ref<devPost>();
const adoptionRequestData = ref<AdoptionRequestData>();
const auth = useAuthStore();
onMounted(async () => {
  const posts = (await getChannelPosts({ channelId: CHANID.AdoptionChannelId })).posts;
  const myPosts = posts.filter((e) => e.author._id === auth.user?._id);
  if (myPosts.length <= 0) return;
  let mostRecent = myPosts[0];
  for (let i = 1; i < myPosts.length; i++) {
    if (new Date(mostRecent.createdAt) < new Date(myPosts[i].createdAt)) {
      mostRecent = myPosts[i];
    }
  }
  adoptionFormPost.value = mostRecent;
});
watch(
  () => adoptionFormPost.value,
  () => {
    if (!adoptionFormPost.value) return;
    const adoptionFormData = JSON.parse(adoptionFormPost.value.title) as adoptionForm;
    adoptionRequestData.value = {
      contact: adoptionFormData.phone,
      email: adoptionFormData.email,
      gender: adoptionFormData.gender,
      name: adoptionFormData.name,
      oathDate: new Date(adoptionFormPost.value.createdAt),
      reqId: adoptionFormData.adoptionNumber,
      questions: [
        {
          question: '입양을 원하시는 가장 큰 이유는 무엇인가요?',
          answer: adoptionFormData.adoptionReason,
        },
        {
          question: '키우고 계신 반려동물이 있나요? 있다면 소개해 주세요.',
          answer: adoptionFormData.hasPet,
        },
        {
          question: '키우던 반려동물을 개인 사정으로 포기한 경험이 있으신가요? 이유는 무엇인가요?',
          answer: adoptionFormData.gaveUpPet,
        },
        {
          question: '가족 구성원은 몇 명인가요? 구성원을 소개해 주세요.',
          answer: adoptionFormData.familyMembers,
        },
      ],
    };
  },
);

onMounted(async () => {
  if (!auth.user) return;

  const posts = (await getAuthorPosts({ authorId: auth.user._id })).posts.filter(
    (e) => e.channel._id === CHANID.FreeChannelId || e.channel._id === CHANID.MissingChannelId,
  );
  posts.sort((a, b) => {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });
  //posts 출력해주세요
  console.log(posts);
});

// 현재 선택된 콘텐츠 (게시글 / 입양신청서)
const currentContent = ref('게시글');

// 버튼 클릭 시 콘텐츠 변경 함수
const changeContent = (content: string) => {
  currentContent.value = content;
};

// 게시글 목업 데이터
const postData = ref({
  imgUrl:
    'https://media.istockphoto.com/id/1853686056/ko/%EC%82%AC%EC%A7%84/%EC%A7%91%EC%97%90%EC%84%9C-%ED%9C%B4%EC%8B%9D%EC%9D%84-%EC%B7%A8%ED%95%98%EB%8A%94-%EA%B3%A8%EB%93%A0-%EB%A6%AC%ED%8A%B8%EB%A6%AC%EB%B2%84.jpg?s=1024x1024&w=is&k=20&c=qrl0V8QEo7JzTYnGk7hPuSKhmryWD5vnLnrWy0C3XzU=',
  author: '신중석',
  date: '2024.10.21',
  title: '우리 강아지 너무 귀엽지 않나요?',
  like: 1498,
  chat: 1498,
});
</script>

<template>
  <div class="myPost">
    <!-- 게시글, 입양신청 버튼섹션 -->
    <div class="myContentText myPostTitleSection position-relative">
      <div class="position-absolute d-flex flex-row gap-4" :style="{ left: '58px', top: '34px' }">
        <!-- 버튼 클릭 시 currentContent 값 변경 -->
        <span
          class="cursorPointer"
          :class="{ currentContentText: currentContent === '게시글' }"
          @click="changeContent('게시글')"
        >
          게시글
        </span>
        <span
          class="cursorPointer"
          :class="{ currentContentText: currentContent === '입양신청서' }"
          @click="changeContent('입양신청서')"
        >
          입양신청서
        </span>
      </div>
    </div>
    <!-- 카드 리스트 섹션 -->
    <div v-motion-pop class="container myPostListSection" v-if="currentContent === '게시글'">
      <MyTravelCard :data="postData" />
    </div>
    <div v-motion-pop class="w-100" v-if="currentContent === '입양신청서'">
      <AdoptionRequestDisplay
        v-if="adoptionRequestData !== undefined"
        :data="adoptionRequestData"
      />
    </div>
  </div>
</template>

<style scoped>
/* 텍스트 */

.currentContentText {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-10);
}
.myContentText {
  font-size: 20px;
  font-weight: 400;
  color: var(--gray-10);
}

/* 나의 게시글 섹션 */
.myPost {
  width: 65%;
  height: 1089px;
  border-radius: 10px;
  box-shadow: 2px 6px 10px var(--gray-3);
  background-color: var(--gray-1);
}

/* 여행 리스트 컨테이너 여역 */
.myPostListSection {
  width: 85%;
  height: 90%;
}

.cursorPointer:hover {
  cursor: pointer;
}

/* 나의 여행 제목 섹션 */
.myPostTitleSection {
  height: 85px;
  border-bottom: 1px solid #e6e6ea;
}
</style>
