import { createPost } from "@/apis/devcourse/Post/createPost";
import { getChannelPosts } from "@/apis/devcourse/Post/getChannelPosts";
import { updatePost } from "@/apis/devcourse/Post/updatePost";
import { ref } from 'vue';
import { useAuthStore } from "@/stores/auth";
import * as CHANID from '@/constants/communityConsts';

interface TravelDestData {
  contentid : string;
  contentTypeId : string;
  name : string;
  locationX : number;
  locationY : number;
}
interface TravelData {
  id: string;
  title: string;
  destData: TravelDestData[][];
}

export default function usePlanner() {
  const auth = useAuthStore();
  if(!auth.isAuth) return null;

  async function GetMyPlans() : Promise<TravelData[]> {
    const allPlannerPosts = (await getChannelPosts({channelId: CHANID.PlannerChannelId})).posts;
    const myPlannerPosts = allPlannerPosts.filter((post)=>post.author._id===auth.user?._id);
    const travelData : TravelData[] = myPlannerPosts.map((post)=>{
      const parsed = JSON.parse(post.title);
      return {
        id: post._id,
        title : parsed.title,
        destData : parsed.destData
      }
    });
    return travelData;
  }
  async function UpdatePlanData(data : TravelData){
    await updatePost({channelId: CHANID.PlannerChannelId, title: JSON.stringify(data), postId: data.id});
  }
  function ReadPlanData(){

  }
  function CreatePlanData(){

  }
  function AddLocationToPlan(){

  }
  return {
    myPlans,
    GetMyPlans, UpdatePlanData, ReadPlanData, CreatePlanData, AddLocationToPlan
  }
}
