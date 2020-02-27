/** Collect Samples */
angular.module('MetronicApp').controller("CollectSamples", function ($scope, $http, $timeout) {
    var CR=this;
    CR.data={samples:[]};
    CR.action=(typeof cd4_action != "undefined")?cd4_action:'';

    CR.clear_psearch=function(){
        CR.psearchk=''; 
        CR.presult=[];
        $("[autofocus]").focus();
    }

    CR.patient_search=function(){
        if(!CR.psearchk){
            return;
        }
        show_loader();
        $http({url: API_URL+'psamples/patient_search', params:{k:CR.psearchk}}).success(
            function(res){
                CR.presult=res.result;

                $timeout(function(){
                    $("#plistbx").scrollTop(0);
                });
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.test='CD4';
    CR.pick_patient=function(rob){
        var flg=0;
        CR.data.samples.forEach(function(v){
            if(rob.patient_id==v.patient_id){
                flg=1;
                return false;
            }
        });
        if(flg==1){
            rob.disabled=true;
            return;
        }

        var ob=angular.copy(rob);
        ob.id='';
        ob.test=CR.test;
        ob.barcode_no='';
        ob.test_type=ob.test=='CD4'?'':'1';
        CR.data.samples.unshift(ob);
        rob.disabled=true;

        $timeout(function(){
            $("#added_samples_div").scrollTop(0);
            $("#added_samples_div .bcode").eq(0).focus();
        });
    }

    CR.unpick_patient=function(patient_id, i){
        CR.data.samples.splice(i,1);
        $.each(CR.presult, function(j, v){
            if(patient_id==v.patient_id){
                CR.presult[j].disabled=false;
                return false;
            }
        });
    }

    CR.change_test=function(rob){
        CR.test=rob.test;
        if(rob.test=='CD4'){
            rob.test_type='';
            rob.barcode_no='';
        }else{
            rob.test_type='1';
        }
    }

    CR.colect_samples=function(){
        var callback=function(){
            var data={samples:JSON.stringify(CR.data.samples), sample_date:$(".sampledate").val()};
            show_loader();
            $http({url: API_URL+'psamples/colect_cd4_vl_samples', method:'POST', data:data}).success(
                function(res){
                    if(res.success){
                        show_alert_msg(res.msg);
                        CR.clear_psearch();
                        CR.data.samples=[];
                        CR.test='CD4';
                    }else{
                        show_alert_msg(res.msg, 'E');
                        //Code Added by Ashish Jain for Heightlight the duplicate barcode
                        if(res.errdata){
                            $('.bcode').each(function(){
                                var barcodeField = $(this);
                                if($.inArray(barcodeField.val(),res.errdata) !== -1){
                                    barcodeField.css("border", "1px solid red");
                                }
                            });
                        }
                        //EOF 
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }

        $(".bcode,.test_type").removeClass('is-invalid');
        var ccd4=0, cvl=0, bcodes=[], err=[];
        CR.data.samples.forEach(function(v,i){
            if(v.test=='CD4' || v.test=='CD4VL'){
                ccd4++;
            }
            if(v.test=='VL' || v.test=='CD4VL'){
                cvl++;

                if(!v.barcode_no){
                    //err="Enter Barcode (Pre-ART: "+v.pre_art_num+")";
                    //return false;
                    $(".bcode"+i).addClass('is-invalid');
                    err.push("Enter Barcode");
                }
                if(!v.test_type){
                    //err="Select Test Type (Pre-ART: "+v.pre_art_num+")";
                    //return false;
                    $(".test_type"+i).addClass('is-invalid');
                    err.push("Select Test Type");
                }
                bcodes.push(v.barcode_no);
            }
        });
        if(err.length){
            err=Array.from(new Set(err));
            show_alert_msg(err.join(" | ")+" (See red colored)", 'E');
            return;
        }

        var uniqueBcodes = Array.from(new Set(bcodes));
        if(uniqueBcodes.length!=bcodes.length){
            show_alert_msg("All barcodes should be unique!", 'E');
            set_duplicate_barcode_err();
            return;
        }
        
        var ctitle='Finish Collecting Samples';
        //var cmsg = '<div class="mb10">Collection Date: <div class="pull-right bold">'+CR.curdate+' (Today)</div></div>'+

        var dinpt='<input type="text" class="form-control dateInpt1 sampledate" readonly value="'+CR.curdate+'" mindate="'+CR.minsdate+'" maxdate="'+CR.curdate+'"></input>';
        var cmsg = 
        
        '<table class="table table-bordered"><tbody><tr class="active">'+
            '<th class="text-center">Total No of Samples Collected</th>'+
            '<th class="text-center">Viral Load Test Samples</th>'+
            '<th class="text-center">CD4 Test Samples</th>'+
        '</tr><tr class="danger">'+
            '<td class="text-center bold">'+(ccd4+cvl)+'</td>'+
            '<td class="text-center bold">'+(cvl)+'</td>'+
            '<td class="text-center bold">'+(ccd4)+'</td>'+
        '</tr></tbody></table>'+
        '<div class="mb10"><div class="pull-left pdT5 pdR10">Collection Date:</div> <div class="pull-left">'+dinpt+'</div><div class="clearfix"></div></div>'+
        '<h3 class="text-center bold text-danger boot-head">Do you want to Continue?</h3>'+
        '<h5 class="pdT10 boot-note">** Samples have been added to collection list and pending for dispatch</h5>';
        open_confirm_bootbox(ctitle, cmsg, callback);

        set_datepicker($(".sampledate"));
        $input = $(".sampledate");
        $input.data('datepicker').hide = function () {};
        $input.datepicker('show');
    }

    CR.list_collected_cd4_samples=function(orderby){
        show_loader();
        $http({url:API_URL+'psamples/list_collected_cd4_samples', params:{orderby:orderby, action:CR.action}}).success(
            function(res) {
                CR.ddata.samples=res.result;
                $timeout(function(){ngvisible();});
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.remove_collected_cd4_sample=function(test_id, i){
        show_loader();
        $http({url:API_URL+'psamples/remove_collected_cd4_sample', method:'POST', data:{id:test_id}}).success(
            function(res) {
                if(res.success){
                    CR.filtered_result.splice(i,1);
                    show_alert_msg(res.msg);
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.dispatch_cd4_samples=function(){
        var nodal_center=$("#nodal_dd").val();
        var callback=function(){
            var sample_ids=[];
            CR.ddata.samples.forEach(function(v){
                sample_ids.push(v.test_id);
            })

            var data={nodal_center:nodal_center, sample_ids:sample_ids.join(",")};
            show_loader();
            $http({url: API_URL+'psamples/dispatch_cd4_samples', method:'POST', data:data}).success(
                function(res){
                    if(res.success){
                        show_alert_msg(res.msg);
                        CR.list_collected_cd4_samples();
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }
        if(!nodal_center*1){
            show_alert_msg("Select Nodal Center", 'E');
            return;
        }
        
        var ctitle='Dispatch CD4 Samples';
        var cmsg = 'Are you sure to dispatch these CD4 samples?';
        open_confirm_bootbox(ctitle, cmsg, callback);
    }

    CR.open_add_more_cd4_samples=function(){
        CR.clear_psearch();
        showModal($("#addMoreCD4Modal"), true);
        $("[autofocus]").focus();
    }

    CR.collect_sample_single=function(rob){
        var flg=0;
        CR.ddata.samples.forEach(function(v){
            if(rob.patient_id==v.patient_id){
                flg=1;
                return false;
            }
        });
        if(flg==1){
            rob.disabled=true;
            return;
        }

        show_loader();
        $http({url: API_URL+'psamples/colect_cd4_sample_single', method:'POST', data:{patient_id:rob.patient_id}}).success(
            function(res){
                if(res.success){
                    rob.disabled=true;
                    CR.list_collected_cd4_samples();
                }else{
                    show_alert_msg(res.msg, 'E');
                }
            }
        ).error(function(res){showHttpErr(res);});
    }
    
    CR.init=function(){
        CR.ddata={samples:[]};
        CR.curdate=moment().format('DD MMM YYYY');
        CR.minsdate=moment().subtract(3, "month").format('DD MMM YYYY');
        if(location.href.indexOf("collected_cd4_samples")!==-1){
            CR.list_collected_cd4_samples();
            apply_select2($("#nodal_dd"), "Select Nodal Center");
        }else{
            $timeout(function(){ngvisible();});
        }
    }
    CR.init();
});


/** Collect EID Samples */
angular.module('MetronicApp').controller("CollectEIDSamples", function ($scope, $http, $timeout) {
    var CR=this;
    CR.data={samples:[]};
    CR.action=(typeof cd4_action != "undefined")?cd4_action:'';

    CR.clear_psearch=function(){
        CR.psearchk=''; 
        CR.presult=[];
        $("[autofocus]").focus();
    }

    CR.infant_search=function(){
        if(!CR.psearchk){
            return;
        }
        show_loader();
        $http({url: API_URL+'ictc/infant_search', params:{k:CR.psearchk}}).success(
            function(res){
                CR.presult=res.result;
                $timeout(function(){
                    $("#plistbx").scrollTop(0);
                });
            }
        ).error(function(res){showHttpErr(res);});
    }

    CR.pick_patient=function(rob){
        var flg=0;
        CR.data.samples.forEach(function(v){
            if(rob.infant_id==v.infant_id){
                flg=1;
                return false;
            }
        });
        if(flg==1){
            rob.disabled=true;
            return;
        }

        var ob=angular.copy(rob);
        ob.id='';
        ob.barcode_no='';
        ob.breastfeeding_type='';
        ob.visit_date=CR.curdate;
        ob.test_type=rob.next_test_type;
        if(rob.first_visit){
            ob.visit_date=rob.visit_date;
        }
        ob.breastfeeding_type=rob.breastfeeding_type;
        CR.data.samples.unshift(ob);
        rob.disabled=true;

        $timeout(function(){
            $("#added_samples_div").scrollTop(0);
            $("#added_samples_div .bcode").eq(0).focus();
        });
    }

    CR.unpick_patient=function(infant_id, i){
        CR.data.samples.splice(i,1);
        $.each(CR.presult, function(j, v){
            if(infant_id==v.infant_id){
                CR.presult[j].disabled=false;
                return false;
            }
        });
    }  

    CR.colect_samples=function(){
        var callback=function(){
            var data={samples:JSON.stringify(CR.data.samples), sample_date:$(".sampledate").val()};
            show_loader();
            $http({url: API_URL+'ictc/collect_eid_samples', method:'POST', data:data}).success(
                function(res){
                    if(res.success){
                        show_alert_msg(res.msg);
                        CR.clear_psearch();
                        CR.data.samples=[];
                    }else{
                        show_alert_msg(res.msg, 'E');
                    }
                }
            ).error(function(res){showHttpErr(res);});
        }

        $(".bcode,.test_type").removeClass('is-invalid');
        var ab_c=0, sdbs_c=0, bcodes=[], err=[];
        CR.data.samples.forEach(function(v,i){
            if(v.test_type*1<=3){
                ab_c++;
            }else{
                sdbs_c++;

                if(!v.barcode_no){
                    $(".bcode"+i).addClass('is-invalid');
                    err.push("Enter Barcode");
                }
            }
            
            if(!v.test_type){
                $(".test_type"+i).addClass('is-invalid');
                err.push("Select Test Type");
            }

            if(!v.visit_date){
                err.push("Enter Visit Date");
            }
            if(!v.breastfeeding_type){
                err.push("Select Feeding Type");
            }

            if(v.barcode_no){
                bcodes.push(v.barcode_no);
            }
        });
        if(err.length){
            err=Array.from(new Set(err));
            show_alert_msg(err.join(" | ")+" (See red colored)", 'E');
            return;
        }

        var uniqueBcodes = Array.from(new Set(bcodes));

        if(uniqueBcodes.length!=bcodes.length){
            show_alert_msg("All barcodes should be unique!", 'E');
            set_duplicate_barcode_err();
            return;
        }
        
        var ctitle='Finish Collecting EID Samples';

        var dinpt='<input type="text" class="form-control dateInpt1 sampledate" readonly value="'+CR.curdate+'" mindate="'+CR.minsdate+'" maxdate="'+CR.curdate+'"></input>';
        var cmsg = ''+ //'<div class="mb10"><div class="pull-left pdT5">Collection Date:</div> <div class="pull-right">'+dinpt+'</div><div class="clearfix"></div></div>'+
        
        '<table class="table table-bordered"><tbody><tr class="active">'+
            '<th class="text-center">Total No of Samples Collected</th>'+
            '<th class="text-center">Antibody Samples</th>'+
            '<th class="text-center">DBS Samples</th>'+
        '</tr><tr class="danger">'+
            '<td class="text-center bold">'+(ab_c+sdbs_c)+'</td>'+
            '<td class="text-center bold">'+(ab_c)+'</td>'+
            '<td class="text-center bold">'+(sdbs_c)+'</td>'+
        '</tr></tbody></table>'+
        '<h3 class="text-center bold text-danger boot-head">Do you want to Continue?</h3>'+
        '<h5 class="pdT10 boot-note">** Samples have been added to collection list and pending for dispatch</h5>';
        open_confirm_bootbox(ctitle, cmsg, callback);

        set_datepicker($(".sampledate"));
    }

    CR.sel_rob={};
    CR.view_test_history=function(rob){
        CR.sel_rob=rob;
        CR.vdata={visit_date:rob.visit_date, breastfeeding_type:rob.breastfeeding_type};
        show_loader();
        $http({url: API_URL+'ictc/beneficiary_detail/'+rob.counseling_id}).success(
            function(res){
                CR.pdtl=res.dtl;
                $("#testHistoryModal").modal();

                $timeout(function(){
                    set_datepicker($(".dateInpt"));
                });
            }
        ).error(function(res){showHttpErr(res);});
    }
    CR.set_visit_details=function(){
        if(!CR.vdata.breastfeeding_type){
            show_alert_msg("Select Feeding Type", "E");
            return;
        }
        CR.sel_rob.visit_date=CR.vdata.visit_date;
        CR.sel_rob.breastfeeding_type=CR.vdata.breastfeeding_type;

        CR.pick_patient(CR.sel_rob);

        $("#testHistoryModal").modal('hide');
    }
    
    CR.init=function(){
        CR.ddata={samples:[]};
        CR.curdate=moment().format('DD MMM YYYY');
        CR.minsdate=moment().subtract(3, "month").format('DD MMM YYYY');
        $timeout(function(){ngvisible();});
    }
    CR.init();
});



/** Non Angular */
function change_sample_test(ob){
    var obj=$(ob);
    var bcode_ob=obj.closest('tr').find('.bcode');
    if(obj.val()=='VL' || obj.val()=='CD4VL'){
        setTimeout(function(){bcode_ob.focus();}, 100);
    }
}

function set_duplicate_barcode_err(){
    $(".bcode").each(function(){
        var v=$(this).val();
        if(v){
            if($(".bcode[value='"+v+"']").length>1){
                $(this).addClass('is-invalid');
            }
        }
    });
}

//EOF