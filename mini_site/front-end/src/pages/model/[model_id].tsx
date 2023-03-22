import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import styles from '@/styles/this_model.module.css'

export default function this_model() {
  
  const router = useRouter();
  const { model_id } = router.query;

  const [model_data, set_model_data] = useState();

  const [thumbnail_image, set_thumbnail] = useState(''); 

  async function get_model(){
    const d = fetch('http://127.0.0.1:8000/get_model/' + model_id)
    .then((response) => response.json())
    .then((data) => {set_model_data(data)})
    return d;
  }
  
  async function get_thumbnail(){
    const thumbnail_image_fetch = await fetch('http://127.0.0.1:8000/get_model/' + model_id + '/thumbnail');
    const thumbnail_blob = await thumbnail_image_fetch.blob();
    const thumbnail_url = URL.createObjectURL(thumbnail_blob);
    set_thumbnail(thumbnail_url);
  }
  
  useEffect(()=> {
    if(model_id == undefined)
      return;
    get_model();
    get_thumbnail();

  }, [model_id])

  return( <div>
    <div className={styles.model_data_div}>
      <Model_details model={model_data}></Model_details>
      <img className={styles.thumbnail_img} src={thumbnail_image}></img>
    </div>
  </div>
  )
}

export function Model_details(props)
{

  
  if(props.model == null || props.model == undefined){
    return <div></div>
  }
  
  
  const this_model = props.model[0];
  const name = this_model[1];
  const price = this_model[2];
  const size = this_model[3];

  return(
  <div>
    <div className={styles.horizontal_div}>
    <p className={styles.main}>{name}</p>
      </div>
    <div className={styles.horizontal_div}>
      <p>{price}</p>
      <p>scale : {size}</p>
    </div>
  </div>  
  ) 
}