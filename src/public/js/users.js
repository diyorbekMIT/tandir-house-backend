console.log("Users frontend javascript file");


$(function () {

    $(".member-status").on("change", async (e) => {
        const id = e.target.id;
        const memberStatus = $(`#${id}.member-status`).val();
        console.log("id: ", id);
        console.log("status: ", memberStatus);
        
        try {
            await axios.post("/admin/user/edit", {
                _id: id,
                memberStatus: memberStatus
            })   
        } catch(err) {
            console.error(err);
            alert("Failed to update member status");
            
        }
      
    })
})