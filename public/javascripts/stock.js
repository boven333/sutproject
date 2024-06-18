$(document).ready(function () {
    // Initialize DataTable
    const table = $("#stock-list").DataTable({
      columns: [
        { data: "id", title: "Stock ID" },
        { data: "name", title: "Name" },
        { data: "model", title: "Model" },
        { data: "description", title: "Description" },
        { data: "price", title: "Price" }
      ],
      columnDefs: [
        { className: "text-center", targets: "_all" },
      ],
    });
  
    const URL = `http://localhost:2020/api/items/companyA`;
    function fetchData() {
      $.ajax({
        type: "GET",
        url: URL,
        success: function (response) {
         try {
            // console.log("Initial Response: ", response);
  
            const $listStock = $("#list-stock");
            $listStock.empty();
    
            response.branch.forEach(branch => {
              branch.sub_branch.forEach(subBranch => {
                const $option = $("<option></option>").val(subBranch.id).text(subBranch.id);
                $listStock.append($option);
              });
            });
    
            $listStock.trigger("change");
            
         } catch (error) {
            console.log("Error", error.message);
         }
        },
        error: function (xhr, status, error) {
          console.error("Error fetching initial data: ", error);
        },
      });
    }
      fetchData();
  
    // Fetch data on dropdown change
    $("#list-stock").on("change", function () {
      const selectedSubBranchId = $("#list-stock").val();
      $.ajax({
        type: "GET",
        url: URL,
        headers: {
          Authorization: 'Bearer ' + token
      },
        success: function (response) {
          try {
            console.log("Subbranch Response: ", response);
  
          // Find selected sub-branch and populate DataTable
          let selectedSubBranch = null;
          response.branch.forEach(branch => {
            branch.sub_branch.forEach(subBranch => {
              if (subBranch.id === selectedSubBranchId) {
                selectedSubBranch = subBranch;
              }
            });
          });
  
          table.clear();
  
          if (selectedSubBranch && selectedSubBranch.stock) {
            selectedSubBranch.stock.forEach(stockItem => {
              table.row.add(stockItem).draw(false);
              console.log('stockItem', stockItem)
            });
          }
          } catch (error) {
            console.log("error", error.message);
          }
        },
        error: function (xhr, status, error) {
          console.error("Error fetching sub-branch data: ", error);
        },
      });
    });

    function getToken() {
      const token = localStorage.getItem('jwtToken')
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        }
      });
      if (!token) {
        Swal.fire({
          title: "The Internet?",
          text: "That thing is still around?",
          icon: "question"
        });
        window.location.href = '/'
      } else {
        Toast.fire({
          icon: "success",
          title: "Signed in successfully"
        });
      }
    };
    getToken()
  
  }); // End
  