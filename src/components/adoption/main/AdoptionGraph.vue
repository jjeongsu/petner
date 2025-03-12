<script setup lang="ts">
import { ref } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Bar } from 'vue-chartjs';

const data: ChartData<'bar'> = {
  labels: ['2019', '2020', '2021', '2022', '2023'],
  datasets: [
    {
      label: '입양',
      data: [26.4, 29.6, 32.1, 27.5, 24.2],
      backgroundColor: 'rgba(95, 170, 104, 0.8)',
    },
    {
      label: '사망',
      data: [46.6, 45.9, 41.5, 43.7, 45.8],
      backgroundColor: 'rgba(243, 114, 63, 0.8)',
    },
  ],
};
const options: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1500,
  },
  scales: {
    y: {
      offset: true,
      title: {
        text: '비율(%)',
        font: { family: 'Paperlogy', size: 16, weight: 'bolder' },
      },
      min: 20,
      max: 50,
      ticks: {
        display: true,
        font: { family: 'Paperlogy', size: 16, weight: 'bolder' },
      },
    },
    x: {
      offset: true,
      title: {
        text: '연도',
        font: { family: 'Paperlogy', size: 16, weight: 'bolder' },
      },
      ticks: {
        font: { family: 'Paperlogy', size: 16, weight: 'bolder' },
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        usePointStyle: true,
        pointStyle: 'circle',
        font: { family: 'Paperlogy', size: 14, weight: 'bold' },
      },
    },
  },
};

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
</script>

<template>
  <div class="banner-wrapper">
    <div class="banner-cards">
      <div class="banner-card">
        <img src="/PNG-Image/images/alert-bell.png" alert="bell image" />
        <p>
          유기동물들에게 <br />
          관심을 기울여주세요
        </p>
      </div>
      <div class="banner-card">
        <p>
          절반이 넘는 유기동물들이 <br />
          <em class="green">보호소</em>에서 <em class="red">사망</em>하고 있습니다.
        </p>
      </div>
    </div>
    <div class="banner-graph">
      <Bar :data="data" :options="options"></Bar>
    </div>
  </div>
</template>

<style scoped>
.banner-wrapper {
  display: flex;
  flex-direction: row;
  gap: 62px;
  margin: 48px 0px;
}

.banner-graph {
  width: 681px;
  height: 473px;
}

.banner-cards {
  display: flex;
  flex-direction: column;
  gap: 57px;
}

.banner-card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 450px;
  height: 164px;
  border-radius: 34px;
  gap: 30px;
  background-color: var(--gray-2);
}

.banner-card img {
  width: 87px;
  height: 87px;
  border-radius: 100%;
}

.banner-card p {
  display: block;
  text-align: center;
  font-size: 26px;
  font-family: 'Paperlogy';
  font-weight: 600;
  margin: 0;
}

em.green {
  font-style: normal;
  color: var(--primary-green);
}

em.red {
  font-style: normal;
  color: var(--primary-red);
}
</style>
