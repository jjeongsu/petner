<script setup lang="ts"></script>

<template>
  <div class="d-flex flex-row justify-content-between gap-5 heroSection">
    <div class="position-relative heroLeft overflow-hidden">
      <img
        src="https://cdn.pixabay.com/photo/2015/05/30/19/53/playing-puppies-790638_1280.jpg"
        alt=""
        class="card-img-top"
      />
      <div
        class="heroLeftText d-flex flex-column position-absolute"
        :style="{ bottom: '20px', left: '20px' }"
      >
        <div class="title">강원도 바다 수영 다녀왔어요</div>
        <div class="subTitle">| 양양 멍비치</div>
      </div>
    </div>

    <div class="heroRight d-flex flex-column justify-content-between">
      <!-- 자유게시판 영역 -->
      <router-link to="/community/free" style="text-decoration: none; color: inherit">
        <div class="position-relative overflow-hidden postNavigation">
          <!-- 이미지 -->
          <img
            class="position-absolute"
            src="/public/CommunityMain/Rectangle 1067.png"
            :style="{ margin: '-10px' }"
          />
          <div
            class="position-absolute d-flex flex-row align-items-center gap-3 justify-content-center"
            :style="{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              whiteSpace: 'nowrap',
            }"
          >
            <img src="/public/CommunityMain/Beach with umbrella.png" />
            <div class="d-flex flex-column gap-2">
              <div class="postNavTitle">자유게시판</div>
              <div class="postNavContent">반려동물과의 이야기, 같이 나눠요!</div>
            </div>
          </div>
        </div>
      </router-link>

      <!-- 동물찾기 게시판 영역 -->
      <router-link to="/community/missing" style="text-decoration: none; color: inherit">
        <div class="position-relative overflow-hidden postNavigation">
          <!-- 이미지 -->
          <img
            class="position-absolute"
            src="/public/CommunityMain/Rectangle 1066.png"
            :style="{ margin: '-10px' }"
          />
          <div
            class="position-absolute d-flex flex-row align-items-center gap-3 justify-content-center"
            :style="{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              whiteSpace: 'nowrap',
            }"
          >
            <img src="/public/CommunityMain/Megaphone.png" />
            <div class="d-flex flex-column gap-2">
              <div class="postNavTitle">실종 신고 게시판</div>
              <div class="postNavContent">실종된 반려동물을 함께 찾아봐요!</div>
            </div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-size: 36px;
  font-weight: 700;
  color: var(--gray-1);
  font-family: 'Paperlogy';
}

.subTitle {
  font-size: 24px;
  font-weight: 500;
  color: var(--gray-1);
  font-family: 'Paperlogy';
}

.postNavTitle {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-10);
  font-family: 'Paperlogy';
}

.postNavContent {
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-10);
  font-family: 'Paperlogy';
}

/* 히어로 섹션 */
.heroSection {
  width: 100%;
  height: 400px;
  margin-top: 73px;
}

.heroLeft {
  background-color: antiquewhite;
  width: 65%;
  height: 400px;
  border-radius: 15px;
}

.heroRight {
  width: 35%;
  height: 400px;
}

.card-img-top {
  height: 400px;
  object-fit: cover;
}

.postNavigation {
  width: 100%;
  height: 190px;
  border-radius: 15px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.postNavigation:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
