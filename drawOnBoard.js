export  function drawOnBoard(canvas,tries)
{
    let ctx=canvas.getContext("2d");
    let width=canvas.width;
    let height=canvas.height;

    switch(tries)
    {
        case 0:
            ctx.beginPath();
            ctx.moveTo(0.2*width,0);
            ctx.lineTo(0.8*width,0);
            ctx.stroke();
            ctx.moveTo(0.2*width,0);
            ctx.lineTo(0.2*width,height*0.9);
            ctx.stroke();
            ctx.moveTo(0,height*0.9);
            ctx.lineTo(width*0.5,height*0.9);
            ctx.stroke();
            ctx.moveTo(0.8*width,0);
            ctx.lineTo(0.8*width,0.15*height);
            ctx.stroke();
            ctx.moveTo(width*0.4,0);
            ctx.lineTo(width*0.2,height*0.2);
            ctx.stroke();

        break;

        case 1:
            ctx.moveTo(0.9*width,0.22*height);
            ctx.arc(0.8*width,height*0.22,height*0.07,0,2*Math.PI);
            ctx.stroke();
            
            break;

            case 2:
                ctx.moveTo(0.8*width,height*0.29);
                ctx.lineTo(0.8*width,height*0.49);
                ctx.stroke();

                break;



                case 3:
                    ctx.moveTo(0.8*width,height*0.29);
                    ctx.lineTo(0.62*width,0.38*height);
                    ctx.stroke();

                    break;


                    case 4:
                        ctx.moveTo(0.8*width,height*0.29);
                        ctx.lineTo(0.98*width,0.38*height);
                        ctx.stroke();
                        break;


                        case 5:
                            ctx.moveTo(0.8*width,0.49*height);
                            ctx.lineTo(0.98*width,height*0.65);
                            ctx.stroke();
                            break;

                            case 6:
                                ctx.moveTo(0.8*width,0.49*height);
                                ctx.lineTo(0.62*width,height*0.65);
                                ctx.stroke();
                                ctx.closePath();
                                break;

            
    }
}



export function clearBoard(canvas)
{
    let ctx=canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);


}