$(document).ready(function () {
  $("#branch-list").DataTable({
    columns: [
      { data: "id", title: "All Branchs" },
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
      { className: "text-center", targets: "_all" },
      { width: "30%", targets: [1] },
    ],
    initComplete: () => {
      // delete action *********************************************
      $("#branch-list tbody").on("click", ".btn-danger", function () {
        const table = $("#branch-list").DataTable();
        const row = table.row($(this).parents("tr"));
        const branchID = row.data().id;
        const deleteUrl = `http://localhost:2020/api/items/companyA/branch/${branchID}`;
        console.log(row.data().id);
        console.log(deleteUrl);
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
              // contentType: "application/json",
              success: function (response) {
                console.log(response);
                table.row(row).remove().draw();
                Swal.fire({
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  icon: "success",
                });
              },
              error: function (xhr, status, error) {
                alert("Error: " + xhr.responseText);
                console.error(xhr, status, error);
              },
            });
          }
        });
      });
      // edit action *********************************************
      $("#branch-list tbody").on("click", ".btn-success", function () {
        const table = $("#branch-list").DataTable();
        const row = table.row($(this).parents("tr"));
        const branchID = row.data().id;
        Swal.fire({
          title: "Update Branch",
          html: `<input id="swal-input-id" class="swal2-input" value=${branchID} placeholder="Branch Name">`,
          showCancelButton: true,
          confirmButtonText: "Update",
          cancelButtonText: "Cancel",
          focusConfirm: false,
          preConfirm: () => {
            if (document.getElementById("swal-input-id").value === branchID) {
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
            console.log(branchName);
            const URL_UPDATE_BRANCH = `http://localhost:2020/api/items/updatebranch/companyA/${branchID}`;
            $.ajax({
              type: "PUT",
              contentType: "application/json",
              url: URL_UPDATE_BRANCH,
              data: JSON.stringify(branchName),
              success: function (response) {
                try {
                  fetchData();
                  Swal.fire({
                    icon: "success",
                    title: "Branch Updated.",
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
      // add Subbranch *********************************************
      $("#branch-list tbody").on("click", ".btn-primary", function () {
        const table = $("#branch-list").DataTable();
        const row = table.row($(this).parents("tr"));
        const branchID = row.data().id;
        Swal.fire({
          title: "Add new Sub Branch",
          html: `<input id="swal-input-id" class="swal2-input" placeholder="Sub Branch Name">`,
          showCancelButton: true,
          confirmButtonText: "Add",
          cancelButtonText: "Cancel",
          focusConfirm: false,
          preConfirm: () => {
            if (!document.getElementById("swal-input-id").value) {
              Swal.showValidationMessage(
                "If you don't Add. Please select Cancel"
              );
            }
            return {
              id: document.getElementById("swal-input-id").value,
            };
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const subbranchName = result.value;
            console.log(subbranchName);
            const URL_ADD_SUBBRANCH = `http://localhost:2020/api/items/subbranch/companyA/branch/${branchID}`;
            console.log("firs:t", URL_ADD_SUBBRANCH)
            $.ajax({
              type: "PUT",
              contentType: "application/json",
              url: URL_ADD_SUBBRANCH,
              data: JSON.stringify(subbranchName),
              success: function (response) {
                try {
                  fetchData();
                  Swal.fire({
                    icon: "success",
                    title: "SubBranch Added.",
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

       // add branch *********************************************
      $("#add-branch").on("click", () => {
        Swal.fire({
          title: "Add new branch",
          html: `<input id="swal-input-id" class="swal2-input" placeholder="Branch Name">`,
          showCancelButton: true,
          confirmButtonText: "Add",
          cancelButtonText: "Cancel",
          focusConfirm: false,
          preConfirm: () => {
            if (!document.getElementById("swal-input-id").value) {
              Swal.showValidationMessage("Input branch Name!");
            }
            return {
              id: document.getElementById("swal-input-id").value,
            };
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const branchName = result.value;
            console.log(branchName);
            const URL_ADD_BRANCH =
              "http://localhost:2020/api/items/addbranch/companyA";
            $.ajax({
              type: "PUT",
              contentType: "application/json",
              url: URL_ADD_BRANCH,
              data: JSON.stringify(branchName),
              success: function (response) {
                try {
                  fetchData();
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
                  Toast.fire({
                    icon: "success",
                    title: "Branch Added!"
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

      // fetch *********************************************
      const URL = "http://localhost:2020/api/items/companyA";
      function fetchData() {
        $.ajax({
          type: "GET",
          url: URL,
          dataType: "json",
          success: function (response) {
            try {
              console.log("data: ", response.branch);
              let table = $("#branch-list").DataTable();
              table.clear().draw();
              $.each(response.branch, function (index, branch) {
                table.row
                  .add({
                    id: branch.id,
                  })
                  .draw(false);
              });
            } catch (error) {
              console.log("Error", error.message);
            }
          },
          error: function (xhr, status, error) {
            console.error("Error fetching data:", error);
          },
        });
      }
      fetchData();

      $("#logout").on("click", function (){
          logout()
      });

      function getToken() {
        const token = localStorage.getItem('jwtToken')
        if (!token) {
          window.location.href = '/'
        }
      };
      getToken()

      function logout() {
            localStorage.removeItem('jwtToken');
      }
    },
  });
});
