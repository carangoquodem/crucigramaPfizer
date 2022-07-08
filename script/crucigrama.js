//Draw grid
function DrawGrid()
{

    $.each(grid,function(i){
        var row = $('<tr></tr>');
        $.each(this,function(j){

            if(this == 0){
                $(row).append('<td class="square empty"></td>');  
            }
            else{
                
                let question_number = String(grid[i][j]).split(",");
                let starting_number = '';
                let question_number_span = '';

                for(let k = 0;k < question_number.length;k++){
                    var direction = get_direction(question_number[k]);
                    let startpos = get_startpos(question_number[k],direction);
                    
                    if(direction == "horizontal" && startpos[0] == i && startpos[1] == j){
                        starting_number += question_number[k]+",";
                    }
                    else if(direction == "vertical" && startpos[0] == j && startpos[1] == i){
                        starting_number += question_number[k]+",";
                    }              
                    
                }

                if(starting_number != ""){
                    question_number_span = '<span class="question_number">'+starting_number.replace(/(^,)|(,$)/g, "")+'</span>';   
                }
                
                if(this.includes(','))
                    $(row).append('<td>'+question_number_span+'<div class="square letter noeditable" data-number="'+this+'" contenteditable="false"></div></td>'); 
                else
                    $(row).append('<td><div class="square letter" data-number="'+this+'" contenteditable="false">'+question_number_span+'</div></td>'); 
            }
        });
        $("#puzzle").append(row);
        
    });

    $("[data-number=3]:first").append('<span class="question_number">3</span>');
    $("[data-number=9]:first").append('<span class="question_number">9</span>');

}

DrawGrid();

    //Draw hints
    let hintsContainer = $("#hints_container");
    hintsContainer.append("<ol class='listHints'></ol>");
    let List = $(".listHints");
    $.each(clues,function(index){
        List.append("<li>"+clues[index]+"</li>");
    });

    $(".letter").keyup(function(){
        var this_text = $(this).text();
        if(this_text.length > 1){
            $(this).text(this_text.slice(0,1));
    }
});

$(".letter").click(function(){
    
    $(".letter").removeClass("active");
    $(this).addClass("active");
    
    $(".hint").css("color","initial");
    
    let question_numbers = String($(this).data("number")).split(",");
    let numbercell = question_numbers;

    if(question_numbers.length > 1)
    {
        if($("[data-number='"+question_numbers+"']")[0].firstChild ==  null)
            return false;
        
        
        numbercell = question_numbers[0];
        let direction = get_directionNew(numbercell);

        if(direction == "vertical" && numbercell != '5')
            numbercell = question_numbers[1];

    }

    $.each(question_numbers,function(){
        $("#hints .hint:nth-child("+this+")").css("color","red");
    });

     
    $("[data-number="+numbercell+"]").addClass("active");
    $("#recipient-name").attr("maxlength",GetAnswerById(numbercell).length);

    $('#modalcrucigrama').modal('show');
    $('.modal-body input').val('');
    $("#label-error").text("");
    $('#recipient-ntmberline').val(numbercell);
    $('#modalcrucigrama').find('.modal-title').text(numbercell);
    $("#label-description").text((clues[numbercell-1]));
    
});



$("#btn_insert").click(function(){
    
    let modalCrucigrama = $('#modalcrucigrama');
    let numberAnswer = $('#recipient-ntmberline').val();
    let word = $('#recipient-name').val();
    let labelError = $("#label-error");

    if((numberAnswer !== null || numberAnswer != undefined) && (word !== null || word != undefined))
    {

        if(checkAnswerModal(numberAnswer, word))
        {
            fillAnswerModal(word, numberAnswer);
            modalCrucigrama.modal('hide');
            $("[data-number="+numberAnswer+"]").removeClass("active");
            $("[data-number="+numberAnswer+"]").addClass("correctword");
        }
        else{
            labelError.removeClass("hidden");
            labelError.text("La palabra introducida no es correcta");
        }
        
    }

});


$("#solve").click(function(){

    for(let word=1;word <= 20;word++)
    {
        for(let cell = 0; cell < $("[data-number="+word+"]").length; cell++)
        {
            let count = 1;

            if(cell == 0 && ($("[data-number="+word+"]")[cell].childNodes.length > 1))
                count = 2;

            if(!($("[data-number="+word+"]")[cell].childNodes.length == count))
                return false;

        }

    }

    $('#modalendgame').modal("show");
    
});

$("#clear_all").click(function(){

    for(let i = 1; i <= (answers.length); i++)
    {
        clearAnswer(i);
    }
    
});

$("#clue").click(function(){
    if(!$(".letter.active").length)
       return;
	var question_numbers = String($(".letter.active").data("number")).split(",");
    showClue(question_numbers[0],$(".letter.active").parent().index(),$(".letter.active").parent().parent().index());
});

function get_direction(question_number){
   
    for(let fila=0;fila < grid.length;fila++){
        for(let column=0;column < grid[fila].length;column++){

            if(String(grid[fila][column]).indexOf(question_number) != -1){  

                if(grid[fila][column] == question_number || grid[fila-1][column] == question_number){
                    return "vertical";
                }

                if(grid[fila][column+1] == question_number || grid[fila][column-1] == question_number){
                    return "horizontal";
                }
            }
        }

    }
    

}

function get_directionNew(question_number){
   
    let result = "vertical";
    let count = 0;
    for(let fila=0;fila < grid.length;fila++){

        for(let cell=0;cell < grid[fila].length;cell++){
            count++;
            
            if(grid[cell].find(element => element == question_number)){
                if(grid[cell].filter(element => element == question_number).length > 1)
                    return "horizontal";
            }

            if(count > 20)
                return "vertical";
                

        }


    }

    return result;
    

}

    
function get_startpos(question_number,direction){
    
	if(direction == "horizontal"){
       for(var i=0;i < grid.length;i++){
            for(var j=0;j < grid[i].length;j++){
                if(String(grid[i][j]).indexOf(question_number) != -1){            
                    return [i,j];
                }
            }
        }
    }
    
    else if(direction == "vertical"){
       for(var i=0;i < grid.length;i++){
            for(var j=0;j < grid[i].length;j++){
                if(String(grid[j][i]).indexOf(question_number) != -1){            
                     return [i,j];
                }
            }
        }
    }
}
    

function clearAnswer(question_number){
    $("#puzzle td div").css("color","initial");
    
    var question_answer = answers[question_number-1];
    var direction = get_direction(question_number);
    var startpos = get_startpos(question_number,direction);
    var answer_letters = question_answer.split("");
    
    if(direction == "horizontal"){
        for(var i = 0; i < answer_letters.length; i++){
            $("#puzzle tr:nth-child("+(startpos[0]+1)+") td:nth-child("+(startpos[1]+1+i)+") div").text('');
            $("#puzzle tr:nth-child("+(startpos[0]+1)+") td:nth-child("+(startpos[1]+1+i)+") div").removeClass("correctword");
        }
    	 
    }
    else if(direction == "vertical"){
        
        for(var i = 0; i < answer_letters.length; i++){
            $("#puzzle tr:nth-child("+(startpos[1]+1+i)+") td:nth-child("+(startpos[0]+1)+") div").text('');
            $("#puzzle tr:nth-child("+(startpos[1]+1+i)+") td:nth-child("+(startpos[0]+1)+") div").removeClass("correctword");
        }
    	 
    }
}


function showClue(question_number,i,j){
    var question_answer = answers[question_number-1];
   // var direction = get_direction(question_number);
    //var startpos = get_startpos(question_number,direction);
    var answer_letters = question_answer.split("");
    
    // if(direction == "horizontal"){
    //     $("#puzzle tr:nth-child("+(j+1)+") td:nth-child("+(i+1)+") div").text(answer_letters[i - startpos[1]]).css("color","initial");
    // }
    // else if(direction == "vertical"){
    //     $("#puzzle tr:nth-child("+(j+1)+") td:nth-child("+(i+1)+") div").text(answer_letters[j - startpos[1]]).css("color","initial");
    // }

    $('#recipient-name').val(answer_letters[0]);

}

function checkAnswerModal(numberAnswer, word)
{
    let correctWord = GetAnswerById(numberAnswer);
    return correctWord.toLowerCase() == word.toLowerCase() ? true : false;
}

function fillAnswerModal(question_answer, numberAnswer){
    
    $("#puzzle td div").css("color","initial");
    
    let direction = get_directionNew(numberAnswer);
    let startpos = get_startpos(numberAnswer,direction);

    if(numberAnswer == 3)
        startpos=[16,1];
    else if(numberAnswer == 9)
        startpos=[7,7];

    let answer_letters = question_answer.split("");
    let span = "<span class='question_number'>"+numberAnswer+"</span>";
    if(direction == "horizontal"){
        for(let i = 0; i < answer_letters.length; i++){

            if(i == 0){
                //console.log(startpos[0]+1 + " - " + startpos[1]+1+i);
                $("#puzzle tr:nth-child("+(startpos[0]+1)+") td:nth-child("+(startpos[1]+1+i)+") div").text('');
                $("#puzzle tr:nth-child("+(startpos[0]+1)+") td:nth-child("+(startpos[1]+1+i)+") div").append(span + answer_letters[i]);
            }
            else{
                //console.log(startpos[0]+1 + " - " + startpos[1]+1+i);
                $("#puzzle tr:nth-child("+(startpos[0]+1)+") td:nth-child("+(startpos[1]+1+i)+") div").text('');
                $("#puzzle tr:nth-child("+(startpos[0]+1)+") td:nth-child("+(startpos[1]+1+i)+") div").append(answer_letters[i]);
            }
        }
    	 
    }
    else if(direction == "vertical"){
        for(let i = 0; i < answer_letters.length; i++){
            if(i == 0){
                //console.log(startpos[1]+1+i +" - "+ startpos[0]+1);
                $("#puzzle tr:nth-child("+(startpos[1]+1+i)+") td:nth-child("+(startpos[0]+1)+") div").text('');
                $("#puzzle tr:nth-child("+(startpos[1]+1+i)+") td:nth-child("+(startpos[0]+1)+") div").append(span +answer_letters[i]);
            } 
            else
            {
                //console.log(startpos[1]+1+i +" - "+ startpos[0]+1);
                $("#puzzle tr:nth-child("+(startpos[1]+1+i)+") td:nth-child("+(startpos[0]+1)+") div").text('');
                $("#puzzle tr:nth-child("+(startpos[1]+1+i)+") td:nth-child("+(startpos[0]+1)+") div").append(answer_letters[i]);
            }
                

        }
    	 
    }


}

function GetAnswerById(id){
    return answers[id-1];
}































