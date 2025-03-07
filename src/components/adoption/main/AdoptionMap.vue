<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import type { CSSProperties } from 'vue';
import SouthKoreaMap from '@/assets/southKoreaHigh.svg';
import PATH from '@/constants/path';
import ShelterCard from './ShelterCard.vue';
import CITY_ORG from '@/constants/api/cityOrg';
import type { OrgType } from '@/types/shelter';
import { useQuery } from '@tanstack/vue-query';
import { getShelterListApi, getShelterInfo } from '@/apis/adoption/shelter';

const selectedRegion = ref('서울특별시');
const cityOrgList = ref<OrgType[]>([]); // 구, 군 리스트

watch(selectedRegion, (newV, oldV) => {
  //선택된 지역이 CITY_ORG의 key안에없다면
  if (!Object.keys(CITY_ORG).includes(selectedRegion.value)) {
    return;
  }
  // 선택된 상위 region에 대한 모든 보호소 를 조회
  cityOrgList.value = [...CITY_ORG[newV]]; // 하위 orgList
  //console.log('cityOrgList', cityOrgList.value);
  refetch();
});

// 1. 모든 구군에 대한 간소화된 shleterList를 얻는다.
const {
  data: shelters,
  isLoading: isLoadingShelters,
  refetch,
} = useQuery({
  queryKey: ['shelters', 'list', selectedRegion],
  queryFn: () =>
    Promise.all(cityOrgList.value.map((org) => getShelterListApi(org.uprCd, org.orgCd))),
});
// 다음쿼리가 실행될 준비가 되었는지 확인한다.
const enabled = computed(() => {
  console.log('shelters value', shelters.value);
  if (shelters.value && (shelters.value.length > 0 || shelters.value !== undefined)) {
    return true;
  }
  return false;
});

// 2. 보호소 별 상세정보를 조회
const {
  data: shelterDetails,
  isLoading: isLoadingShelterDetails,
  // refetch,
} = useQuery({
  queryKey: ['shelterDetails', 'list', selectedRegion],
  queryFn: () => {
    console.log('두번째 쿼리가 작동', '원본 shelters', shelters.value);
    //
    const flatShelters = computed(() => shelters.value?.flatMap((A) => A));

    return Promise.all(flatShelters.value!.map((shelter) => getShelterInfo(shelter.careRegNo)));
  },
  enabled, // 준비 완료시 queryFn 실행
});

const shelterInfoList = computed(() => {
  const result = shelterDetails.value
    ?.map((data) => data.body.items.item)
    .filter((v) => v != undefined);
  console.log('result', result);
  return result;
});
const tooltipText = ref('');
const tooltipStyle = ref<CSSProperties>({
  position: 'absolute',
  top: '0px',
  left: '0px',
  background: 'var(--secondary-green)',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '16px',
  color: 'var(--gray-1)',
  pointerEvents: 'none',
  zIndex: '10',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
  opacity: '0',
});

const attachRegionEvents = () => {
  nextTick(() => {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return;
    const paths = svgElement.querySelectorAll('path[data-region]');
    paths.forEach((path) => {
      path.addEventListener('click', () => {
        const region = path.getAttribute('data-region');
        if (region) {
          selectedRegion.value = region;
          paths.forEach((p) => {
            p.setAttribute(
              'fill',
              p.getAttribute('data-region') === region ? 'var(--primary-red)' : '#ddd',
            );
          });
        }
      });
      path.addEventListener('mouseenter', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const region = path.getAttribute('data-region') || '';
        tooltipText.value = region;
        tooltipStyle.value.left = mouseEvent.pageX + 'px';
        tooltipStyle.value.top = mouseEvent.pageY - 40 + 'px';
        tooltipStyle.value.opacity = '1';
        if (region !== selectedRegion.value) {
          path.setAttribute('fill', '#ffcccc');
        }
      });
      path.addEventListener('mousemove', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        tooltipStyle.value.left = mouseEvent.pageX + 'px';
        tooltipStyle.value.top = mouseEvent.pageY - 40 + 'px';
      });
      path.addEventListener('mouseleave', () => {
        tooltipText.value = '';
        tooltipStyle.value.opacity = '0';
        if (path.getAttribute('data-region') !== selectedRegion.value) {
          path.setAttribute('fill', '#ddd');
        }
      });
    });
  });
};

onMounted(() => {
  attachRegionEvents();
});
</script>

<template>
  <div class="wrapper">
    <div id="tooltip" v-if="tooltipText" :style="tooltipStyle">
      {{ tooltipText }}
    </div>

    <div class="title d-flex justify-content-between align-items-center">
      <span>사랑을 기다리는 아이들, 보호소에서 만나보세요!</span>
      <router-link :to="PATH.adoptionShelter">더보기</router-link>
    </div>
    <div class="d-flex justify-content-between">
      <div class="map">
        <SouthKoreaMap width="100%" height="125%" />
      </div>
      <div class="shelter-info-wrapper">
        <div class="shelter-title-card mb-3">
          <span
            >{{ selectedRegion }} 동물보호센터 <em>{{ shelterInfoList?.length }}</em
            >개소</span
          >
        </div>
        <div
          v-if="isLoadingShelterDetails || isLoadingShelters"
          class="d-flex justify-items-center"
        >
          로딩중
        </div>
        <div class="card-list-wrapper">
          <ShelterCard
            v-for="shelter in shelterInfoList"
            :key="shelter.careNm"
            :shelter="shelter[0]"
          />
        </div>
      </div>
    </div>
    <!-- <div class="mt-4 text-center">
      <span v-if="selectedRegion">선택된 지역: {{ selectedRegion }}</span>
      <span v-else>지역을 클릭해 선택해주세요.</span>
    </div> -->
  </div>
</template>

<style scoped>
.wrapper {
  margin: 100px 0;
}
.title span {
  font-size: 36px;
  font-weight: 700;
}
.title a {
  font-size: 16px;
  font-weight: 600;
  color: var(--primary-blue);
  text-decoration: none;
}
.title {
  margin-bottom: 42px;
}
.map {
  width: 580px;
  height: 645px;
  transform: translateY(-160px);
}
.shelter-info-wrapper {
  width: 664px;
  height: 645px;
}
.shelter-title-card {
  width: 100%;
  height: 100px;
  border-radius: 17px;
  background-color: var(--gray-2);
  display: flex;
  justify-content: center;
  align-items: center;
}
.shelter-title-card span {
  font-size: 36px;
  font-weight: 600;
}
.shelter-title-card span em {
  font-style: normal;
  color: var(--primary-red);
}

.card-list-wrapper {
  height: 545px;
  overflow-y: scroll;
}
</style>
