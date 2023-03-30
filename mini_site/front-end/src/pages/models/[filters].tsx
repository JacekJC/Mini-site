import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import model_tile_styles from '@/styles/model_tile_styles.module.css';
import models_page_styles from '@/styles/models_page_styles.module.css';


class thumbnail_request_queue
{
    queue = [];
    doing = false;    

    add_request(model_id : number){
      this.queue.push(model_id);
      this.do_request(); 
    };

    do_request(){
        if(this.doing)
            return;
        if(this.queue.length > 0)
        {
            get   
        }
    }
}


export default function get_models()
{
    const router = useRouter();
    const { filters } = router.query;

    const [displayed_models, set_displayed_models] = useState();
    const [displayed_models_thumbnails, set_displayed_models_thumbnails] = useState();
    var current_index = 0;

    async function load_models(amount: number){
        const d = await fetch('http://127.0.0.1:8000/models/' + 'none' + '/' + 0 + '/' + 10)
        const new_d = await d.json();
        set_displayed_models((prev_state) => [...prev_state, new_d[0]]);
        let acc_data = new_d[0];
        acc_data.forEach((element) => 
        {
            console.log(element[0]);
            //get_model_thumbnail(element[0]);
            thumbnail_request_queue.add_request(element[0]);
        })
    }

    async function get_model_thumbnail(model_id: number){

        const new_img = await fetch('http://127.0.0.1:8000/get_model/' + model_id + '/thumbnail');
        const res = await new_img.blob();
        const url = URL.createObjectURL(res);
        
        if(displayed_models_thumbnails == undefined || displayed_models_thumbnails.length < model_id)
        {
            set_displayed_models_thumbnails((prev_state) => [...prev_state, url]);
        }
        else
        {

        }
        
        
        /*let ele : HTMLElement | null = document.getElementById('model' + Number);
        let img : Element | undefined = ele?.children[0];
        if(img != null)
            img.src = url;*/
        console.log(model_id, ' thumbnail loaded');
        return url;
    }
    
    class thumbnail_request_queue
    {
        static queue : number[] = [];
        static doing = false;    

        static add_request(model_id : number){
            this.queue.push(model_id);
            if(!this.doing)
            {
                this.do_request(); 
            }
        };

        static do_request(){
            if(this.queue.length > 0)
            {   
                this.doing = true;
                let prom = new Promise((resolve, reject) => {
                    let url = get_model_thumbnail(this.queue[0]);
                    console.log('loading ' + this.queue[0] + " thumbnail");
                    if(url != null)
                    {
                        resolve('URL');
                    }
                    reject
                    {
                        reject('Error');
                    }
                });
                this.queue.pop(0);
                prom.then((message) => {
                    console.log("loading next thumbnail");
                    this.do_request();
                });
                prom.catch((error) => this.do_request());
            }
            else{
                this.doing = false;
            }
        };
    }

    useEffect(() => {
        if(displayed_models == undefined && current_index == 0)
        {
            set_displayed_models([]);
            set_displayed_models_thumbnails([]);
            load_models(10);
            current_index = 10;
        }
    }, [])

    return (
        <>
            <div style={{height: '90px', width: '100vw', backgroundColor: 'rgb(20, 20, 20)'}}>
                <p> Filters : {filters} </p>
            </div>
            <div className={models_page_styles.models_grid}>
                <Model_list models={displayed_models} thumbnails={displayed_models_thumbnails}></Model_list>
            </div>
        </>
    )
}

export function Model_list(props)
{
    const thumbnails = props.thumbnails;
    const pre_models = props.models;

    if(pre_models == undefined || pre_models.length == 0)
        return <p> no value </p>;

    const models = pre_models[0];
    //console.log(models);

    return models.map((val : [], index : number) => {
        //console.log(val);
        return <button className={model_tile_styles.model_tile} id={"model" + index} key={index} onClick={() => {document.location.href = 'http://localhost:3000/model/' + val[0]; console.log('localhost:3000/model/' + val[0]);} }> 
            <img src = {thumbnails[index]}></img>
            <div>
                <p> {val[2]} </p>
                <div className={model_tile_styles.sub_div}>
                    <p> {val[1]} </p>
                    <p> {val[3]} </p>
                </div>
            </div>
        </button>;
        }
    )
}