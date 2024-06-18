$(document).ready(function () {
  const URL = `http://localhost:2020/api/items/companyA`;

  const table = $("#sub-branch-list").DataTable({
    columns: [
      {
         data: null,
         title: "stock",
         defaultContent: `
                  <button class='btn btn-info' type='button' style="border-radius: 100%">
                      <i class="bi bi-car-front-fill" style="color: white;">
                      </i>
                  </button>`
      },
      { data: "id", title: "Sub branch name" },
      {
        data: null,
        title: "MANAGE",
        defaultContent: `
             <div>
              <button class='btn btn-primary'  type='button' style="border-radius: 100%"> 
                 <i class="bi bi-plus-lg"></i>
               </button>
               <button class='btn btn-danger'  type='button' style="border-radius: 100%"> 
                  <i class="bi bi-trash3"></i>
              </button>
               <button class='btn btn-success'  type='button' style="border-radius: 100%"> 
                 <i class="bi bi-pencil"></i> 
               </button>
             </div>
           `,
      },
    ],
    columnDefs: [
      { width: "10%", targets: [0] },
      { width: "20%", targets: [2] },
      { className: "text-center", targets: "_all" },
    ],
    initComplete: () => {
      fetchData();
    },
  });

  function fetchData() {
    $.ajax({
      type: "GET",
      url: URL,
      success: function (response) {
        const $listSubbranch = $("#list-subbranch");
        $listSubbranch.empty();
        $.each(response.branch, function (index, item) {
          const $option = $("<option></option>").val(item.id).text(item.id);
          $listSubbranch.append($option);
        });

        $listSubbranch.trigger("change");
      },
      error: function (xhr, status, error) {
        console.error("Error fetching initial data: ", error);
      },
    });
  }
  
   

  $("#list-subbranch").on("change", function () {
    const selectedBranchId = $("#list-subbranch").val();
    $.ajax({
      type: "GET",
      url: URL,
      success: function (response) {
        const selectedBranch = response.branch.find(
          (branch) => branch.id === selectedBranchId
        );

        table.clear();

        if (selectedBranch && selectedBranch.sub_branch) {
          selectedBranch.sub_branch.forEach((subbranch) => {
            table.row.add({ id: subbranch.id }).draw(false);
          });
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching sub-branch data: ", error);
      },
    });
  });

   // Show stock table on stock button click
  $('#sub-branch-list tbody').on("click", ".btn-info", function () {
    const row = table.row($(this).parents("tr"));
    const sub_branch_id = row.data().id;
    const branch_id = $("#list-subbranch").val();

    $.ajax({
      type: "GET",
      url: URL,
      success: function (response) {
        const selectedBranch = response.branch.find(
          (branch) => branch.id === branch_id
        );

        if (selectedBranch) {
          const selectedSubBranch = selectedBranch.sub_branch.find(
            (subbranch) => subbranch.id === sub_branch_id
          );

          if (selectedSubBranch && selectedSubBranch.stock) {
            const stockList = `
              <table id="stock_list" class="display" style="width:100%; font-size: 14px">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Model</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>MANAGE</th>
                  </tr>
                </thead>
                <tbody>
                  ${selectedSubBranch.stock.map(stock => `
                    <tr>
                      <td>${stock.id}</td>
                      <td>${stock.name}</td>
                      <td>${stock.model}</td>
                      <td>${stock.description}</td>
                      <td>${stock.price}</td>
                      <td>
                         <div>
                          <button class='btn btn-danger btn-delete' type='button' style="border-radius: 100%"> 
                              <i class="bi bi-trash3"></i>
                          </button>
                          <button class='btn btn-success btn-update' type='button' style="border-radius: 100%"> 
                            <i class="bi bi-pencil"></i> 
                          </button>
                       </div>
                      </td>
                    </tr>`).join('')}
                </tbody>
              </table>`;

            Swal.fire({
              title: 'Stock',
              html: stockList,
              width: '80%',
              didOpen: () => {
                const stockTable = $('#stock_list').DataTable({
                  columnDefs: [
                    { className: "text-center", targets: "_all" },
                    { width: "10%", targets: [5] },
                    { width: "10%", targets: [4] },
                    { width: "20%", targets: [0] }
                  ]
                });

                // Add Stock
                $('.btn-add').on("click", function () {
                  alert("eee")
                  const stockRow = stockTable.row($(this).parents("tr")).data();
                  Swal.fire({
                    title: "Add Stock",
                    html: `
                      <input id="swal-input-name" class="swal2-input" placeholder="Name">
                      <input id="swal-input-model" class="swal2-input" placeholder="Model">
                      <input id="swal-input-description" class="swal2-input" placeholder="Description">
                      <input id="swal-input-price" class="swal2-input" placeholder="Price">`,
                    showCancelButton: true,
                    confirmButtonText: "Add",
                    cancelButtonText: "Cancel",
                    focusConfirm: false,
                    preConfirm: () => {
                      return {
                        name: document.getElementById("swal-input-name").value,
                        model: document.getElementById("swal-input-model").value,
                        description: document.getElementById("swal-input-description").value,
                        price: document.getElementById("swal-input-price").value
                      };
                    }
                  }).then((result) => {
                    if (result.isConfirmed) {
                      const stockVal = result.value;
                      const addStockUrl = `http://localhost:2020/api/items/addstock/companyA/branch/${branch_id}/${sub_branch_id}`;
                      $.ajax({
                        type: "PUT",
                        contentType: "application/json",
                        url: addStockUrl,
                        data: JSON.stringify(stockVal),
                        success: function () {
                          fetchData();
                          const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                              toast.onmouseenter = Swal.stopTimer;
                              toast.onmouseleave = Swal.resumeTimer;
                            }
                          });
                          Toast.fire({
                            icon: "success",
                            title: "Stock Added!"
                          });
                        },
                        error: function (xhr, status, error) {
                          console.error("Error adding stock:", error);
                        }
                      });
                    }
                  });
                });

                // Delete Stock
                $('#stock_list tbody').on("click", ".btn-delete", function () {
                  const stockRow = stockTable.row($(this).parents("tr")).data();
                  const stockId = stockRow[0]; // Assuming the ID is the first column
                  const deleteStockUrl = `http://localhost:2020/api/items/stock/companyA/branch/${branch_id}/${sub_branch_id}/${stockId}`;
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
                  }).then((result) => {
                    if (result.isConfirmed) {
                      $.ajax({
                        type: "DELETE",
                        url: deleteStockUrl,
                        success: function () {
                          const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                              toast.onmouseenter = Swal.stopTimer;
                              toast.onmouseleave = Swal.resumeTimer;
                            }
                          });
                          Toast.fire({
                            icon: "success",
                            title: "Deleted!"
                          });
                        },
                        error: function (xhr, status, error) {
                          console.error("Error deleting stock:", error);
                        }
                      });
                    }
                  });
                });

                // Update Stock
                $('#stock_list tbody').on("click", ".btn-update", function () {
                  const stockRow = stockTable.row($(this).parents("tr")).data();
                  const stockId = stockRow[0]; // Assuming the ID is the first column
                  Swal.fire({
                    title: "Update Stock",
                    html: `
                      <input id="swal-input-name" class="swal2-input" value="${stockRow[1]}" placeholder="Name">
                      <input id="swal-input-model" class="swal2-input" value="${stockRow[2]}" placeholder="Model">
                      <input id="swal-input-description" class="swal2-input" value="${stockRow[3]}" placeholder="Description">
                      <input id="swal-input-price" class="swal2-input" value="${stockRow[4]}" placeholder="Price">`,
                    showCancelButton: true,
                    confirmButtonText: "Update",
                    cancelButtonText: "Cancel",
                    focusConfirm: false,
                    preConfirm: () => {
                      return {
                        name: document.getElementById("swal-input-name").value,
                        model: document.getElementById("swal-input-model").value,
                        description: document.getElementById("swal-input-description").value,
                        price: document.getElementById("swal-input-price").value
                      };
                    }
                  }).then((result) => {
                    if (result.isConfirmed) {
                      const updatedStock = result.value;
                      const updateStockUrl = `http://localhost:2020/api/items/stock/companyA/branch/${branch_id}/${sub_branch_id}/${stockId}`;
                      $.ajax({
                        type: "PUT",
                        contentType: "application/json",
                        url: updateStockUrl,
                        data: JSON.stringify(updatedStock),
                        success: function () {
                          fetchData();
                          const Toast = Swal.mixin({
                            toast: true,
                            position: "top-end",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                            didOpen: (toast) => {
                              toast.onmouseenter = Swal.stopTimer;
                              toast.onmouseleave = Swal.resumeTimer;
                            }
                          });
                          Toast.fire({
                            icon: "success",
                            title: "Update successfully"
                          });
                        },
                        error: function (xhr, status, error) {
                          console.error("Error updating stock:", error);
                        }
                      });
                    }
                  });
                });
              },
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'No Stock',
              text: 'This sub-branch has no stock.',
              icon: 'info',
              confirmButtonText: 'OK'
            });
          }
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching stock data: ", error);
      }
    });
  });

  $("#sub-branch-list tbody").on("click", ".btn-danger", function () {
    const row = table.row($(this).parents("tr"));
    const sub_branch = row.data().id;
    const branch = $("#list-subbranch").val();
    const deleteUrl = `http://localhost:2020/api/items/subbranch/companyA/branch/${branch}/${sub_branch}`;
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          type: "DELETE",
          url: deleteUrl,
          success: function (response) {
            table.row(row).remove().draw();
            Swal.fire({
              title: "Deleted!",
              text: "Your sub-branch has been deleted.",
              icon: "success",
            });
          },
          error: function (xhr, status, error) {
            Swal.fire({
              title: "Error!",
              text: "There was an error deleting the sub-branch.",
              icon: "error",
            });
            console.error("Error: ", xhr, status, error);
          },
        });
      }
    });
  });

  $("#sub-branch-list tbody").on("click", ".btn-success", function () {
    const row = table.row($(this).parents("tr"));
    const sub_branch = row.data().id;
    const branch = $("#list-subbranch").val();
    const UpdateUrl = `http://localhost:2020/api/items/updatesub/companyA/branch/${branch}/${sub_branch}`;
    Swal.fire({
      title: "Update Sub Branch",
      html: `<input id="swal-input-id" class="swal2-input" value="${sub_branch}" placeholder="Branch Name">`,
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      preConfirm: () => {
        if (document.getElementById("swal-input-id").value === sub_branch) {
          Swal.showValidationMessage(
            "If you don't update. Please select Cancel"
          );
        }
        return {
          id: document.getElementById("swal-input-id").value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const branchName = result.value;
        $.ajax({
          type: "PUT",
          contentType: "application/json",
          url: UpdateUrl,
          data: JSON.stringify(branchName),
          success: function (response) {
            try {
              fetchData();
              Swal.fire({
                icon: "success",
                title: "Sub Branch Updated.",
                showConfirmButton: false,
                timer: 2000,
              });
            } catch (error) {
              console.log("update error", error);
            }
          },
          error: function (xhr, status, error) {
            console.error("Error fetching data:", error);
          },
        });
      }
    });
  });

  $("#sub-branch-list tbody").on("click", ".btn-primary", function () {
    const row = table.row($(this).parents("tr"));
    const sub_branch = row.data().id;
    const branch = $("#list-subbranch").val();
    const URL_ADD_STOCK = `http://localhost:2020/api/items/addstock/companyA/branch/${branch}/${sub_branch}`;
    Swal.fire({
      title: "Add Stock",
      html: `
        <input id="swal-input-name" class="swal2-input" placeholder="Name">
        <input id="swal-input-model" class="swal2-input" placeholder="Model">
        <input id="swal-input-description" class="swal2-input" placeholder="Description">
        <input id="swal-input-price" class="swal2-input" placeholder="Price">
      `,
      showCancelButton: true,
      confirmButtonText: "Add",
      cancelButtonText: "Cancel",
      focusConfirm: false,
      preConfirm: () => {
        if (
          !document.getElementById("swal-input-name").value ||
          !document.getElementById("swal-input-model").value ||
          !document.getElementById("swal-input-description").value ||
          !document.getElementById("swal-input-price").value
        ) {
          Swal.showValidationMessage("Input stock!");
        }
        return {
          name: document.getElementById("swal-input-name").value,
          model: document.getElementById("swal-input-model").value,
          description: document.getElementById("swal-input-description").value,
          price: document.getElementById("swal-input-price").value,
        };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const StockVal = result.value;
        $.ajax({
          type: "PUT",
          contentType: "application/json",
          url: URL_ADD_STOCK,
          data: JSON.stringify(StockVal),
          success: function (response) {
            try {
              fetchData();
              Swal.fire({
                icon: "success",
                title: "Stock Added.",
                showConfirmButton: false,
                timer: 2000,
              });
            } catch (error) {
              console.log("add error", error);
            }
          },
          error: function (xhr, status, error) {
            console.error("Error fetching data:", error);
          },
        });
      }
    });
  });

  function getToken() {
    const token = localStorage.getItem('jwtToken')
    if (!token) {
      window.location.href = '/'
    }
  };
  getToken()

  fetchData();
});
