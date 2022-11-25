const {
    ipcRenderer
} = require('electron');

ipcRenderer.on('action-update-label', (event, arg) => {
    let label = document.getElementById("label");
    label.innerHTML = arg.message;
    label.style.color = arg.color;
    label.style.backgroundColor = arg.backgroundColor;
});

// staff login
$(document).on('click', '.login-banner .in', function() {
    var getID = $(this).attr('id');
    console.log("getID == " + getID)
    if (getID == "admin") {
        if (localStorage.getItem("pl_token") != null && localStorage.getItem("pl_token") != "undefined") {
            verifyManager(localStorage.getItem("pl_token"))
            $('#store-list').css({
                'display': 'none!important'
            })
        } else {
            $('#store-list').css({
                'display': 'none!important'
            })
            // $('.tableHide').css({'display':'none'});
        }

    } else if (getID == "staff") {
        $('#staff-container').show();
        $('#admin-container').hide();
        if (localStorage.getItem("pl_token") != null && localStorage.getItem("pl_token") != "undefined") {
            localStorage.clear()
        }

    } else {}
});

// Admin Form Submit Button
$('.admin-otp-form, .staff-dashboard, #new-transaction, .adminForm, .store-list, .not-found, #show, .dashboard, .hide-section,.transaction-btn').css({
    'display': 'none'
});
$('#staff-container').hide();

// admin login form
$(document).on('click', '#admin-email', function(e) {
    e.preventDefault();
    var email_label = $('#email').val();
    emailotp(email_label)
    if (email_label == "") {
        Swal.fire({
            text: 'Enter Valid Email'
        })
    } else {
        var data = {
            "login": email_label,
            "role": "master"
        }
        var dataJson = JSON.stringify(data);

        fetch('https://znap.app/api/v6/manager/login', {
            method: "POST",
            body: dataJson,
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },

        }).then(function(test) {
            return test.json()

        }).then(function(callback) {
            if (callback.status == "success") {
                $('.admin-otp-form').css({
                    'display': 'block'
                });
                $('.adminForm').css({
                    'display': 'none'
                });

            } else if (callback.status == "failure") {
                $('.login-error-message').html(callback.message);

            }
        });

    }
});


// admin email otp 
function emailotp(email_label) {
    $(document).on('click', '.email-otp', function(e) {
        e.preventDefault();
        var email = email_label;
        var otp = $('.login-otp').val();
        if (otp == "") {
            Swal.fire('Enter Valid OTP');
        } else {
            var data = {
                "login": email,
                "otp": otp
            }
            var dataJson = JSON.stringify(data)


            fetch('https://znap.app/api/v6/manager/otp', {
                method: "POST",
                body: dataJson,
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },

            }).then(function(test) {
                return test.json()

            }).then(function(callback) {
                if (callback.status == "success") {
                    verifyManager(callback.token);
                    $('#store-list').show();
                } else if (callback.status == "failure") {
                    $('.admin-email-otp').html(callback.message);
                }
            });
       }
    });
}



// dashboard
//     setTimeout(function() {
//          $(document).on('click','.dash',function(){
//         var dashId=$(this).attr('id');
//         localStorage.setItem('dash_id', dashId);
//     });
// },500);
setTimeout(function() {
    $(document).on('click', '.slist', function() {
        $('.hide-section, .dashboard').css({
            'display': 'block'
        });
        $('.transaction-btn').css({
            'display': 'block'
        });
        $('#store-list, #show ').css({
            'display': 'none'
        });
        var dataJson = {
            "admin_id": localStorage.getItem("pl_token"),
            "store_id": $(this).attr('id')
        };
        console.log('ids' + JSON.stringify(dataJson))
        fetch('https://znap.app/api/v6/manager/home', {
            method: "POST",
            body: JSON.stringify(dataJson),
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },

        }).then(function(test) {
            return test.json()

        }).then(function(callback) {
            console.log('Store Details' + JSON.stringify(callback))
            var branches = "";
            var branch_list = callback.branches;
            var branch = branch_list.map(function(x) {
                branches += "<option value=" + x.id + ">" + x.branch + "</option>";
            })
            // console.log("branch list")
            $('#branch-list').html(branches);
            $('#branch-list option:nth-child(2)').prop('selected', true);
            // localStorage.setItem("admin_store", callback.profile.store_logo)
            // localStorage.setItem("admin_store_name", callback.profile.store_name)
            $('.store-logo').attr('src', callback.profile.store_logo);
            $('.store-name').html(callback.profile.store_name);
            $('.branchs').html($('#branch-list option:selected').text());
            getDashboard();

        });
    });
}, 1000);
$('.transaction-btn').on('click', function() {
    $('.hide-section').css({
        'display': 'none'
    });
    $('#show').show();
});
$('.dashboardBtn').on('click', function() {
    $('.hide-section').css({
        'display': 'block'
    });
    $('#show').css({
        'display': 'none'
    });
});


$(document).on('click', '#admin', function() {
    $('.adminForm').css({
        'display': 'block'
    })
    $('.login-banner').css({
        'display': 'none'
    });
    $('#store-list').css({
        'display': 'none!important'
    })
})
$("#branch-list").on('change', function() {
    $('.branchs').html($('#branch-list option:selected').text());
    getDashboard();
});

function getDashboard() {
    console.log("Dashboard")
    var data_json = {
        "admin_id": localStorage.getItem("pl_token"),
        "store_id": localStorage.getItem('store_ids'),
        "branch_id": $('#branch-list').val()
    };
    localStorage.setItem('branchlist', $('#branch-list').val())
    fetch('https://znap.app/api/v6/manager/dashboard/master', {
        method: "POST",
        body: JSON.stringify(data_json),
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },

    }).then(function(test) {
        return test.json()

    }).then(function(callback) {
        console.log("dashboard/master == " + JSON.stringify(callback))
        if (callback.status == "success") {
            $('.billing-heading span').html("(" + callback.time_period + ")")
            $('#znapay-box .z-count').html(callback.znapay.count);
            $('#znapay-box .z-value').html(parseFloat(callback.znapay.value).toFixed(2));
            $('#redemption-box .z-count').html(callback.redemption.count);
            $('#redemption-box .z-value').html(parseFloat(callback.redemption.value).toFixed(2));
            $('#takeaway-box .z-count').html(callback.takeaway.count);
            $('#takeaway-box .z-value').html(parseFloat(callback.takeaway.value).toFixed(2));
            $(".nav-link").removeClass("active")
            $("#today .nav-link").addClass("active")
            getTransactions();

        }
   });
}

function getTransactions(duration = "today") {
    console.log("Transactions")
    var dataJsons = {
        "admin_id": localStorage.getItem("pl_token"),
        "role": localStorage.getItem("role"),
        "duration": duration,
        "store_id": localStorage.getItem("store_ids"),
        "branch_id": $('#branch-list').val(),
        "page": "dashboard"
    }
    fetch('https://znap.app/api/v6/manager/transactions-web', {
        method: "POST",
        body: JSON.stringify(dataJsons),
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },

    }).then(function(test) {
        return test.json()

    }).then(function(callback) {
        console.log(callback)
        var days_data = callback.transaction_list;
        if (callback.status == "success" && days_data.length == 0) {
            $('.chart-data').html("<tr><td colspan='7'><p><span>Data Not Found</span></p></td></tr>");
        } else {
            var table = "";
            var table_map = days_data.map(function(x) {
                table += "<tr>";
                table += "<td class='ref-id'>" + x.reference_id + "</td>";
                // table += "<td>" + x.store_name + "</td>";
                table += "<td>" + x.username + "</td>";
                table += "<td>" + x.date + "</td>";
                table += "<td>" + x.offer_type_label + "</td>";
                table += "<td>" + x.offer_class + "</td>";
                table += "<td>" + x.store_location + ", " + x.store_city + "</td>";
                table += "<td  class='dash-bill'>AED " + parseFloat(x.bill_amount).toFixed(2) + "</td>";
                table += "</tr>";
            });
            $('.chart-data').html(table);
            $('.dash-table').DataTable().destroy();
            setTimeout(function() {
                $('.chart-data').html(table);
                $('.dash-table').DataTable({
                    "bSort": false
                });
            }, 500);
        }
    });
}

// transaction
var admin_id = "";
var role = localStorage.getItem("role")
if (role == "master") {
    // $('#f-date').datepick({dateFormat: 'yyyy-mm-dd'});
    // $('#t-date').datepick({dateFormat: 'yyyy-mm-dd'});
    admin_id = localStorage.getItem("pl_token");
} else if (role == "branch") {
    admin_id = localStorage.getItem("tl_token");
} else if (role == "staff") {
    admin_id = localStorage.getItem("sl_token");
}


$(document).on('click', '.transaction-submit', function(event) {
    event.preventDefault();
    var from_date = $("#f-date").val();
    var to_date = $("#t-date").val();
    var offerType = $('#offerType option:selected').val();
    // alert(offerType)
    var transDetails = {
        "admin_id": admin_id,
        "role": role,
        "from_date": from_date != undefined && from_date != "" ? from_date : "",
        "to_date": to_date != undefined && to_date != "" ? to_date : "",
        "offer_type": offerType,
        "store_id": localStorage.getItem('store_ids'),
        "branch_id": localStorage.getItem('branchlist')
    }
    console.log(transDetails)
    console.log('Siva' + JSON.stringify(transDetails))
    fetch('https://znap.app/api/v6/manager/transactions-web', {
        method: "POST",
        body: JSON.stringify(transDetails),
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },

    }).then(function(test) {
        return test.json()

    }).then(function(callback) {
        console.log(callback)
        var ListTransation = "";
        var transList = callback.transaction_list;
        if (callback.transaction_list.length == 0) {
            $('.not-found').html("<p>Data Not Found");
            $('.not-found').css({
                'display': 'block'
            });
            $('#transtable').css({
                'display': 'none'
            });
        } else {
            var mapList = transList.map(function(x, y) {
                $('#transtable').css({
                    'display': 'block'
                });
                if (y == 0) {
                    localStorage.setItem("last_transaction", x.transaction_id)
                }
                ListTransation += "<tr id=" + x.transaction_id + ">";
                ListTransation += "<td>" + x.reference_id + "</td>";
                ListTransation += "<td>" + x.date + "</td>";
                ListTransation += "<td>" + x.offer_type_label + "</td>";
                ListTransation += "<td><span class='badge badge-pill badge-info' id=" + x.offer_class + ">" + x.offer_class + "</span></td>";
                ListTransation += "<td>" + x.store_location + ", " + x.store_city + "</td>";
                ListTransation += "<td id='bill-amount' class='text-right'>AED " + parseFloat(x.bill_amount).toFixed(2) + "</td>";
                ListTransation += "<td class='view'>View</td>";
                ListTransation += "</tr>";
            });
            $('#transaction-list').html(ListTransation);
            $('.not-found').css({
                'display': 'none'
            });
            $('#transtable').DataTable().destroy();
            setTimeout(function() {
                $('#transaction-list').html(ListTransation);
                $('#transtable').DataTable({
                    "bSort": false,
                    dom: 'Bfrtip',
                     buttons: [
                    'copy', 'csv', 'excel', 'pdf', 'print'
                 ]
                });
            }, 100);
        }
    });
});
$(document).on('click', '.view', function() {
    var id = $(this).closest('tr').attr('id');

    fetch('https://znap.app/api/v6/manager/transaction-detail', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                "admin_id": localStorage.getItem("pl_token"),
                "transaction_id": id
            })
        }).then(function(call) {
            return call.json()
        })
        .then(function(x) {

            console.log(x)
            var single_transaction = "";
            single_transaction += "<div class='container print'><div class='row text-center' id='receipt'><div class='col-md-12'>";
            single_transaction += "<div class='address'><h5>" + x.store_name + "</h5><p>" + x.store_location + ", " + x.store_city + "</p>";
            single_transaction += "</div><div class='customer'><p><span class='pull-left'>Reference No: " + x.reference_id + "</span><span class='pull-right'>" + x.date + "</span></p>";
            single_transaction += "<p class='location'><span class='pull-left'>" + offerTypeLabel(x.offer_type) + "</span></p></div>";
            single_transaction += "<div class='receipt-table'>";
            single_transaction += "";
            single_transaction += "";
            single_transaction += "<table class='table table-light'><tbody>";
            single_transaction += "<tr class='bill-amount'> <td><b>Bill Amount <span class='pull-right'>-</span></b></td><td class='amount'><b>AED " + parseFloat(x.bill_amount).toFixed(2) + "</b></td></tr>"

            if (parseFloat(x.voucher_amount) > 0) {
                single_transaction += "<tr> <td>Credits Used<span class='pull-right'>-</span></td><td>AED " + parseFloat(x.voucher_amount).toFixed(2) + "</td></tr>"
            }

            var rewards_used = 0
            if (parseFloat(x.znapcash_amount) > 0) {
                rewards_used += parseFloat(x.znapcash_amount)
            }
            if (parseFloat(x.storecash_amount) > 0) {
                rewards_used += parseFloat(x.storecash_amount)
            }
            if (rewards_used > 0) {
                single_transaction += "<tr> <td>Rewards Used<span class='pull-right'>-</span></td><td>AED " + parseFloat(rewards_used).toFixed(2) + "</td></tr>"
            }

            if (parseFloat(x.discount_amount) > 0) {
                single_transaction += "<tr> <td>Discount Amount<span class='pull-right'>-</span></td><td>AED " + parseFloat(x.discount_amount).toFixed(2) + "</td></tr>"
            }

            var rewards_earned = 0
            if (parseFloat(x.storecash_earned) > 0) {
                rewards_earned += parseFloat(x.storecash_earned)
            }
            if (parseFloat(x.promocash_earned) > 0) {
                rewards_earned += parseFloat(x.promocash_earned)
            }
            if (rewards_earned > 0) {
                single_transaction += "<tr> <td>Rewards Earned<span class='pull-right'>-</span></td><td>AED " + parseFloat(rewards_earned).toFixed(2) + "</td></tr>"
            }

            single_transaction += "<tr class='payment-amount'> <td><b>Payment Amount <span class='pull-right'>-</span></b></td><td class='amount'><b>AED " + parseFloat(x.payment_amount).toFixed(2) + "</b></td></tr>"

            single_transaction += "</tbody></table></div></div></div>";

            Swal.fire({
                html: single_transaction
            });
            $('.swal2-container').css({
                'z-index': '9999'
            });

        })


});

function offerTypeLabel(offer_type) {
    var offer_type_label = "";
    if (offer_type == "znapay") {
        offer_type_label = "Znapay";
    } else if (offer_type == "redeem-voucher") {
        offer_type_label = "Redeem Credits";
    } else if (offer_type == "znap-voucher") {
        offer_type_label = "Credits";
    } else if (offer_type == "takeaway") {
        offer_type_label = "Takeaway";
    } else {
        offer_type_label = "";
    }
    return offer_type_label
}

function verifyManager(data) {
    var datas = {
        "admin_id": data
    };
    var dataJson = JSON.stringify(datas);
    fetch('https://znap.app/api/v6/manager/verify-user', {
        method: "POST",
        body: dataJson,
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },

    }).then(function(test) {
        return test.json()

    }).then(function(callback) {
        localStorage.setItem("role", "master")
        localStorage.setItem("pl_token", data)
        localStorage.setItem("admin_id", data);
        localStorage.setItem("stores_count", JSON.stringify(callback.stores));
        var dropdownStore = callback.stores;
        if (dropdownStore.length > 0) {
            var menu_list = "";
            var menu_lists = dropdownStore.map(function(x) {
                menu_list += "<option value=" + x.store_id + ">" + x.store_name + "</option>";
                localStorage.setItem('storeId', x.store_id);

            });
            $('#drop-down').html(menu_list);
        }
        if (callback.status == "success") {
            var store = "";
            if (callback.stores.length > 0) {
                console.log("callback.stores == " + JSON.stringify(callback.stores))
                if (callback.stores.length == 1) {
                    window.location = "dashboard.html?id=" + callback.stores[0].id;
                } else {
                    var stores = callback.stores.map(function(x) {
                        localStorage.setItem('store_ids', x.store_id)
                        store += "<div class='col-md-6 col-6 slist' id=" + localStorage.getItem('store_ids') + ">";
                        store += "<div class='bg-info'>";
                        store += "<img src=" + x.store_logo + " class='img-fluid'>";
                        store += "<p class='store-head'>" + x.store_name + "</p>";
                        store += "<p style='display:none' id='hidden-data'><sspan>" + x.store_id + "</span></p>";
                        store += "</div>";
                        store += "</div>";
                    });
                }
            }
            $('#store-list').html(store);
            $('.admin-otp-form').css({
                'display': 'none'
            });
            // $('.swal2-container, .login-content').hide();
        }

    });


}
$(document).on('click', '.logout', function() {
    localStorage.clear();
    window.location = "admin.html"; // TO REFRESH THE PAGE
});

$(document).on('change', '#drop-down', function() {
    var storeIds = $('#drop-down option:selected').val();
    $('.hide-section, .dashboard').css({
        'display': 'block'
    });
    $('.transaction-btn').css({
        'display': 'block'
    });
    $('#store-list, #show ').css({
        'display': 'none'
    });
    var dataJson = {
        "admin_id": localStorage.getItem("pl_token"),
        "store_id": storeIds
    };
    console.log('dropdown' + JSON.stringify(dataJson))
    fetch('https://znap.app/api/v6/manager/home', {
        method: "POST",
        body: JSON.stringify(dataJson),
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },

    }).then(function(test) {
        return test.json()

    }).then(function(callback) {
        console.log('Store Details' + JSON.stringify(callback))
        var branches = "";
        var branch_list = callback.branches;
        var branch = branch_list.map(function(x) {
            branches += "<option value=" + x.id + ">" + x.branch + "</option>";
        })
        // console.log("branch list")
        $('#branch-list').html(branches);
        $('#branch-list option:nth-child(2)').prop('selected', true);
        // localStorage.setItem("admin_store", callback.profile.store_logo)
        // localStorage.setItem("admin_store_name", callback.profile.store_name)
        $('.store-logo').attr('src', callback.profile.store_logo);
        $('.store-name').html(callback.profile.store_name);
        $('.branchs').html($('#branch-list option:selected').text());
        getDashboard();

    });
});

$(document).on('click', '#staff-codes', function(e) {
    e.preventDefault();
    $('.login-error-message').html("").hide();
    var staff_code = $('#store-code').val();
    // otp(mobile)
    if (staff_code == "") {
        Swal.fire('Enter Store Code')
    } else {

        fetch('https://znap.app/api/v6/manager/code', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({
                    "login": staff_code,
                    "role": "staff"
                })
            }).then(function(call) {
                return call.json()
            })
            .then(function(callback) {
                if (callback.status == "success") {
                    if (callback.status == "success") {
                        localStorage.setItem("role", "staff")
                        staffData(callback)
                        $('.staff-dashboard').css({
                            'display': 'block'
                        });
                        $('.staff-row1').css({
                            'display': 'none'
                        });
                        // window.location.href = "transaction-lists.html?store_id=" + callback.store_id + "&branch_id=" + callback.branch_id;
                    } else if (callback.status == "failure") {
                        Swal.fire('code not match');
                    } else {
                        if (callback.type == "access") {
                            $("#staff-login-form").show()
                        } else {
                            Swal.fire(callback.message);
                        }
                    }
                    // $('.card').hide();
                } else if (callback.status == "failure") {
                    $('.login-error-message').html(callback.message);
                    $('.login-error-message').show();
                }
            })

    }
});
$(document).on("click", "#alarm .inactive", function() {
    $(this).removeClass("inactive").addClass("active")
    $("audio#notification")[0].play()
});

$(document).on("click", "#alarm .active", function() {
    $(this).removeClass("active").addClass("inactive")
});

function staffData(data) {
    localStorage.setItem("admin_id", data.token)
    localStorage.setItem("sl_token", data.token)
    localStorage.setItem("store-ids", data.store_id)
    // localStorage.setItem("store_name", callback.store_name)
    localStorage.setItem("store_branch", data.branch_id)
    console.log("callback == " + JSON.stringify(data))
    $('.staff-store-logo').attr('src', data.store_logo);
    $('.staff-store-name').html(data.store_name);
    $('.staff-store-branchs').html(data.store_branch);
}
var admin_id = ""
var role = localStorage.getItem("role")
if (role == "master") {
    admin_id = localStorage.getItem("pl_token");
} else if (role == "branch") {
    admin_id = localStorage.getItem("tl_token");
} else if (role == "staff") {

    $(".date-filter").show()
    admin_id = localStorage.getItem("sl_token");
}

$(document).on('click', '.get-transaction', function(e) {
    e.preventDefault();
    var from_date = $("#from-date").val();
    var to_date = $("#to-date").val();
    fetch('https://znap.app/api/v6/manager/transactions-web', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                "admin_id": localStorage.getItem("admin_id"),
                "role": localStorage.getItem("role"),
                "from_date": from_date != undefined && from_date != "" ? from_date : "",
                "to_date": to_date != undefined && to_date != "" ? to_date : "",
                "offer_type": 'znapay',
                "store_id": localStorage.getItem('store-ids'),
                "branch_id": localStorage.getItem('store_branch')
            })
        }).then(function(call) {
            return call.json()
        })
        .then(function(callback) {

            $('#transaction-lists').html("")
            $("#transaction-dates").html("Transactions from " + callback.from_date + " to " + callback.to_date)
            var ListTransation = "";
            var transList = callback.transaction_list;
            if (callback.transaction_list.length == 0) {
                $('.not-found').html("<p>Data Not Found");
                ListTransation = "<tr><td colspan='7' align='center'>No Transactions</td></tr>"
                $('#transaction-lists').html(ListTransation);
            } else {
                var mapList = transList.map(function(x, y) {
                    if (y == 0) {
                        localStorage.setItem("last_transaction", x.transaction_id)
                    }
                    var email_help = x.elapsed_time <= 1800 ? "<i class='fa fa-envelope-o email-help' aria-hidden='true'></i>" : ""
                    // <i class="fa fa-envelope-o" aria-hidden="true"></i>
                    ListTransation += "<tr id=" + x.transaction_id + ">";
                    ListTransation += "<td class='reference-id'>" + x.reference_id + "</td>";
                    ListTransation += "<td>" + x.date + "</td>";
                    ListTransation += "<td>" + x.offer_type_label + "</td>";
                    ListTransation += "<td>" + x.offer_class + "</td>";
                    ListTransation += "<td>" + x.store_location + ", " + x.store_city + "</td>";
                    ListTransation += "<td class='bill-amount' style='text-align:center!important'>AED " + parseFloat(x.bill_amount).toFixed(2) + "</td>";
                    ListTransation += "<td>" + email_help + "</td>";
                    ListTransation += "</tr>";
                });

                
                setTimeout(function() {
                    $('#transaction-lists').html(ListTransation);
                    $('#staff-transtable').DataTable({
                        "bSort": false,
                        retrieve: true,
                        responsive: true
                    });
                }, 1000); 
                // $('#staff-transtable').DataTable().destroy();
            
            }
        })

});
$(document).on('click', '#new-transaction', function() {
    getTransactions()
    $("#new-transaction").hide()
});
staffTransaction();
setInterval(checkTransactions, 20000);
function staffTransaction(){
    var from_date = $("#from-date").val();
    var to_date = $("#to-date").val();
    var offerType = $('#offerType option:selected').val();
    // alert(offerType)
    var transStaff = {
        "admin_id": localStorage.getItem("admin_id"),
        "role": localStorage.getItem("role"),               
        "offer_type": 'znapay',
        "from_date": from_date != undefined && from_date != "" ? from_date : "",
        "to_date": to_date != undefined && to_date != "" ? to_date : "",
        "store_id": localStorage.getItem('store-ids'),
        "branch_id": localStorage.getItem('store_branch')
    }
    console.log(transStaff)
    console.log('SivaStaff' + JSON.stringify(transStaff))
    fetch('https://znap.app/api/v6/manager/transactions-web', {
        method: "POST",
        body: JSON.stringify(transStaff),
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        },

    }).then(function(test) {
        return test.json()

    }).then(function(callback) {
        $('#transaction-lists').html("")
            $("#transaction-dates").html("Transactions from " + callback.from_date + " to " + callback.to_date)
            var ListTransation = "";
            var transList = callback.transaction_list;
            if (callback.transaction_list.length == 0) {
                $('.not-found').html("<p>Data Not Found");
                ListTransation = "<tr><td colspan='7' align='center'>No Transactions</td></tr>"
                $('#transaction-lists').html(ListTransation);
            } else {
                var mapList = transList.map(function(x, y) {
                    if (y == 0) {
                        localStorage.setItem("last_transaction", x.transaction_id)
                    }
                    var email_help = x.elapsed_time <= 1800 ? "<i class='fa fa-envelope-o email-help' aria-hidden='true'></i>" : ""
                    // <i class="fa fa-envelope-o" aria-hidden="true"></i>
                    ListTransation += "<tr id=" + x.transaction_id + ">";
                    ListTransation += "<td class='reference-id'>" + x.reference_id + "</td>";
                    ListTransation += "<td>" + x.date + "</td>";
                    ListTransation += "<td>" + x.offer_type_label + "</td>";
                    ListTransation += "<td>" + x.offer_class + "</td>";
                    ListTransation += "<td>" + x.store_location + ", " + x.store_city + "</td>";
                    ListTransation += "<td class='bill-amount' style='text-align:center!important'>AED " + parseFloat(x.bill_amount).toFixed(2) + "</td>";
                    ListTransation += "<td>" + email_help + "</td>";
                    ListTransation += "</tr>";
                });
                
                
                setTimeout(function() {
                    $('#transaction-lists').html(ListTransation);
                    $('#staff-transtable').DataTable({
                        "bSort" : false,
                        retrieve: true,
                        responsive: true
                    });
                }, 100);
                
            }
        
    });
}
function checkTransactions() {
    if (localStorage.getItem("last_transaction") != null) {
        var test={
            "admin_id": localStorage.getItem("admin_id"),
            "role": localStorage.getItem("role"),               
            "offer_type": 'znapay',
            "store_id": localStorage.getItem('store-ids'),
            "branch_id": localStorage.getItem('store_branch')
    };
        console.log("transJson check == " + JSON.stringify(test));
        fetch('https://znap.app/api/v6/manager/transactions-web-check', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify({
                "admin_id": localStorage.getItem("admin_id"),
                "role": localStorage.getItem("role"),               
                "offer_type": 'znapay',
                "store_id": localStorage.getItem('store-ids'),
                "branch_id": localStorage.getItem('store_branch')
        })
        }).then(function(call) {
            return call.json()
        })
        .then(function(callback) {
        console.log('Siva'+JSON.stringify(callback))
            if (callback.transaction_id.id > localStorage.getItem('last_transaction')) {
                (async () => {
                    // create and show the notification
                    function playSound() {
                      const audio = new Audio("./assets/alarm.mp3");
                      audio.play();
                    }
                    const showNotification = () => {
                        // create a new notification
                        const notification = new Notification('Znap Live Notification', {
                            body: 'New order received',
                            icon: './assets/images/takeaway.png'
                           
                        },  playSound());
                      
                        // close the notification after 10 seconds

                        setTimeout(() => {
                            notification.close();
                        }, 10 * 100000);
                
                        // navigate to a URL when clicked
                        notification.addEventListener('click', () => {
                
                        });
                    }
                
                    // show an error message
                    const showError = () => {
                        const error = document.querySelector('.error');
                        error.style.display = 'block';
                        error.textContent = 'You blocked the notifications';
                    }
                
                    // check notification permission
                    let granted = false;
                
                    if (Notification.permission === 'granted') {
                        granted = true;
                    } else if (Notification.permission !== 'denied') {
                        let permission = await Notification.requestPermission();
                        granted = permission === 'granted' ? true : false;
                    }
                
                    // show notification or error
                    granted ? showNotification() : showError();
                    $("#new-transaction").show();
                })();
                $('#staff-transtable').DataTable().clear().destroy();
                $('#staff-transtable').empty();
                $('#staff-transtable').DataTable({
                    "bSort": false,
                    retrieve: true,
                    responsive: true
                });
             
            }
        
        })
    }
}