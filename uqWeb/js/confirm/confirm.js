Vue.component('confirm',{
    template:`<div class="pop-up" v-if="show" :class="show == true ? 'pop-up-in' : 'pop-up-leave'">
                <div class="pop-con" :class="show == true ? 'pop-con-enter' : 'pop-con-leave'">
                    <div class="content" v-html="content"></div>
                    <div class="btn">
                        <div class="cancel" v-if="showconcel" @click="concel" v-html="conceltext"></div>
                        <div class="confirm" @click="confirm" v-html="confirmtext"></div>
                    </div>
                </div>
            </div>`,
    name:'confirm',
    props:{
        show:{
            type:Boolean,
            default:false
        },
        content:String,
        showconcel:{
            type:Boolean,
            default:true
        },
        conceltext:{
            type:String,
            default:'取消'
        },
        confirmtext:{
            type:String,
            default:'确定'
        }
    },
    methods: {
        concel(){
            this.show = false
            this.$emit('on-cancel')
        },
        confirm(){
            this.show = false
            this.$emit('on-confirm')
        }
    },
    mounted () {
        
    }
    
})