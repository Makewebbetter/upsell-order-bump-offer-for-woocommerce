jQuery(document).ready( function($) {
    // Function to fetch the vales of options table to check if the popup should be enabled or not.
    // function show_correct_popup_on_bump_offer(){
        var result_same_id_popup = '';
        same_id_check = jQuery('.order_bump_id').val();
        jQuery.ajax({

            type    : 'post',
            dataType: 'json',
            async   : false,
            url     : mwb_ubo_lite_public.ajaxurl,
            data: { 
                nonce         : mwb_ubo_lite_public.auth_nonce,
                same_id_check : same_id_check,
                action        : 'fetch_options_for_demo_purpose',
            },
            success: function( msg ) {
               result_same_id_popup = msg;
            }
        });
    // }


/*==================================================================================================================================
        Check if bump is not checked by deafault, unset the session which was made to get the Order id so that coupon restriction
        can be applied.
====================================================================================================================================*/
    // order_bump_index         = $('.add_offer_in_cart').closest('.mwb_upsell_offer_main_wrapper').find( '.order_bump_index' ).val();
    // parent_wrapper_class     = '.mwb_ubo_wrapper_' + order_bump_index;
    // if (!( $( parent_wrapper_class + ' .add_offer_in_cart' ).is( ':checked' ) ) ) {
    //     jQuery.ajax({
    //         type    : 'post',
    //         dataType: 'json',
    //         url     : mwb_ubo_lite_public.ajaxurl,
    //         data: { 
    //             nonce                : mwb_ubo_lite_public.auth_nonce,
    //             was_order_bump_id    : was_order_bump_id,
    //             was_order_bump_count : was_order_bump_count,
    //             action               : 'unset_session_if_bump_unchecked',
    //         },  
    //         success: function( msg ) {

    //         }
    //     });
    // }

/*==================================================================================================================================
        END
====================================================================================================================================*/

    $(document).on('click','#place_order',function(){
        order_bump_index         = $('.add_offer_in_cart').closest('.mwb_upsell_offer_main_wrapper').find( '.order_bump_index' ).val();
        parent_wrapper_class     = '.mwb_ubo_wrapper_' + order_bump_index;
        var was_order_bump_id    = $('.order_bump_id').val();
        var was_order_bump_count = $('#unique_id_for_encountered_bump').val();
        if ( $( parent_wrapper_class + ' .add_offer_in_cart' ).is( ':checked' ) ) {
            // Run an ajax here.
            jQuery.ajax({
                type    : 'post',
                dataType: 'json',
                async   : false,
                url     : mwb_ubo_lite_public.ajaxurl,
                data: { 
                    nonce                : mwb_ubo_lite_public.auth_nonce,
                    was_order_bump_id    : was_order_bump_id,
                    was_order_bump_count : was_order_bump_count,
                    action               : 'send_value_of_count_and_bump_id_start_session',
                },  
                success: function( msg ) {

                }
            });
            // var obj = {};
            // obj = {
            //     'id':was_order_bump_id,
            //     'count':was_order_bump_count
            // };

            // var json_str = JSON.stringify(obj);
            // createCookie('CookieForOrderPage', json_str);

            // Function to create the cookie 
            // function createCookie(name, value) { 
                // var expires;    
                // if (days) { 
                //     var date = new Date(); 
                //     date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); 
                //     expires = "; expires=" + date.toGMTString(); 
                // } 
                // else { 
                //     expires = ""; 
                // } 
                // document.cookie = name + "=" +  
                //     value + "; path=/"; 
            // } 
            //
        } else {
            // var obj = {};
            // obj = {
            //     'msg':'not set'
            // };
            // [ was_order_bump_id , was_order_bump_count];
            // var json_str = JSON.stringify(obj);
            // document.cookie = 'CookieForOrderPage' + "=" + json_str + "; path=/";
        }
        // var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?arg=1';    
        // window.history.pushState({ path: refresh }, '', refresh);
    })
    



    // When bump is prepared we will get this data.
    var bump_id = '';
    var bump_discount = '';
    var bump_target_cart_key = '';
    var default_image = '';
    var default_price = '';
    var order_bump_index = '';
    var order_bump_id = '';
    var smart_offer_upgrade = '';
    var selected_order_bump = '';
    var selected_order_bump_popup = '';

    function mwb_ubo_lite_intant_zoom_img( selected_order_bump_popup ) {

        if( mwb_ubo_lite_public.mobile_view != 1 ) {

            selected_order_bump_popup.find( '.woocommerce-product-gallery__image' ).zoom();
        }
    }

    // Prevent Enter Key Press for checkbox of Order Bump offers.
    $(document).on( 'keypress', '.add_offer_in_cart', function(e) {

        // The enter key code.
        if( e.which == 13 ) {

            e.preventDefault();
        }
    });


/*==================================================================================================================================
                        Function to check the whether the bumps should be checked, depending on the number of times it has been used.
====================================================================================================================================*/
    function mwb_ubo_count_of_usage_of_orderbump( order_bump_id ) {
        var response;
        jQuery.ajax({
            type    :'post',
            datatype:'json',
            async   :false,
            url     : mwb_ubo_lite_public.ajaxurl,
            data    : { 
                nonce : mwb_ubo_lite_public.auth_nonce,
                action: 'check_if_the_bump_can_be_used_anymore', 
                id    :order_bump_id,
            },
            success: function( msg ){
                response = msg;
            }

        })
        return response;
    }

/*==========================================================================
                        Add to cart checkbox click
============================================================================*/
    /**
     * CHECKBOX ADD TO CART [ works with simple product and product variations ].
     */
    $(document).on( 'click', '.add_offer_in_cart', function(e) {
        order_bump_index     = $(this).closest('.mwb_upsell_offer_main_wrapper').find( '.order_bump_index' ).val();
        parent_wrapper_class = '.mwb_ubo_wrapper_' + order_bump_index;
        order_bump_id        = $(this).closest('.mwb_upsell_offer_main_wrapper').find( '.order_bump_id' ).val();
        if( mwb_ubo_count_of_usage_of_orderbump(order_bump_id) == 'positive' ) {
            // Disable bump div.
            $( '.mwb_ubo_wrapper_' + order_bump_index ).css( 'pointer-events', 'none' );
            $( '.mwb_ubo_wrapper_' + order_bump_index ).css( 'opacity', '0.1' );

            if ( $( parent_wrapper_class + ' .add_offer_in_cart' ).is( ':checked' ) ) {
                // Show loader for Variable offers.
                if( 'variable' == $(this).closest('.mwb_upsell_offer_main_wrapper').find( '.offer_shown_id_type' ).val() ) {
                    $( '.mwb_bump_popup_loader' ).css( 'display','flex' );
                    is_variable_product = $(this).closest('.mwb_upsell_offer_main_wrapper').find( '.offer_shown_id_type' ).val()
                } else {
                    $( '.mwb_bump_popup_loader' ).css( 'display','flex' );
                    is_variable_product = '';
                }


                bump_id              = $(this).closest('.mwb_upsell_offer_main_wrapper').find( '.offer_shown_id' ).val(); // offer product id.
                bump_discount        = $(this).closest('.mwb_upsell_offer_main_wrapper').find( '.offer_shown_discount' ).val();
                bump_target_cart_key = $(this).closest('.mwb_upsell_offer_main_wrapper').find( '.target_id_cart_key' ).val();
                smart_offer_upgrade  = $(this).closest('.mwb_upsell_offer_main_wrapper').find( '.order_bump_smo' ).val();
                
                check_for_pro        = $('#bump_hidden_check_pro').val();
                custom_form_toggle   = $('.custom_fields_for_orderbump_toggle').val();
                console.log(custom_form_toggle);

                // Variable to store all the values from the array.
                var array_variable_store_all_values = [];
                
                // Add product to cart.
                jQuery.ajax({

                    type: 'post',
                    dataType: 'json',
                    url: mwb_ubo_lite_public.ajaxurl,
                    data: { 
                        nonce : mwb_ubo_lite_public.auth_nonce,
                        action: 'add_offer_in_cart',
                        id: bump_id, // offer product id.
                        discount: bump_discount,
                        bump_target_cart_key: bump_target_cart_key,
                        order_bump_id: order_bump_id,
                        smart_offer_upgrade: smart_offer_upgrade,
                        custom_form_toggle : custom_form_toggle,
                        // Index : index_{ digit }
                        bump_index: order_bump_index,
                        is_variable_product : is_variable_product,
                    },

                    success: function( msg ) {

                        // For variable product.
                        if( msg['key'] == 'true' ) {

                            variation_popup_index = order_bump_index.replace( 'index_', '' );
                            // Show price.
                            
                            // ERROR 2.
                            // $( '.mwb_ubo_price_html_for_variation' ).html( msg['message'] );
                            
                            $( '.mwb_bump_popup_loader' ).css('display','none');
                            // Popup show.
                            $( '.mwb_bump_popup_' + variation_popup_index ).css('display','flex');
                            $('body').addClass( 'mwb_upsell_variation_pop_up_body' );

                            // Add zoom to defaut image.
                            selected_order_bump_popup = jQuery( '.mwb_bump_popup_' + variation_popup_index );
                            mwb_ubo_lite_intant_zoom_img( selected_order_bump_popup );

                            if( default_price == '' ) {
                                default_price = $( '.mwb_ubo_price_html_for_variation' ).html();
                            }
                        
                        }
                        // For simple Products and Variations.
                        else {
                            // Variable to store values of the popup fields with same class name.
                            if( result_same_id_popup != false && check_for_pro=='active' ) {
                                $('.mwb_bump_popup_custom_input_wrapper').css('display','flex');
                            } 
                            if( (custom_form_toggle == 'hide' && check_for_pro == 'active') || (check_for_pro == 'inactive' ) )
                            {
                                $( '.mwb_bump_popup_loader' ).css('display','none');
                                $( 'body' ).trigger( 'update_checkout' );
                                $( '.mwb_ubo_wrapper_' + order_bump_index ).css( 'pointer-events', 'all' );
                                $( '.mwb_ubo_wrapper_' + order_bump_index ).css( 'opacity', '1' );

                                // When Reload is required.
                                if( 'subs_reload' == msg ) {
                                    
                                    // Scroll Top and Reload.
                                    $("html, body").scrollTop( 300 );
                                    location.reload();
                                }
                            }
                            // $( 'body' ).trigger( 'update_checkout' );
                            // $( '.mwb_ubo_wrapper_' + order_bump_index ).css( 'pointer-events', 'all' );
                            // $( '.mwb_ubo_wrapper_' + order_bump_index ).css( 'opacity', '1' );

                            // // When Reload is required.
                            // if( 'subs_reload' == msg ) {
                                
                            //     // Scroll Top and Reload.
                            //     $("html, body").scrollTop( 300 );
                            //     location.reload();
                            // }
                        }
                    } 
                });
            } else {
                // Remove the same product from cart.
                jQuery.ajax({

                    type: 'post',
                    dataType: 'json',
                    url: mwb_ubo_lite_public.ajaxurl,
                    data: { 
                        nonce : mwb_ubo_lite_public.auth_nonce,
                        action: 'remove_offer_in_cart',

                        // Index : index_{ digit }
                        bump_index: order_bump_index,
                        order_bump_id: order_bump_id, 
                    },
                    
                    success: function( msg ) {

                        $( 'body' ).trigger( 'update_checkout' );
                        $( '.mwb_ubo_wrapper_' + order_bump_index ).css( 'pointer-events', 'all' );
                        $( '.mwb_ubo_wrapper_' + order_bump_index ).css( 'opacity', '1' );  
                    }
                });
                // $('.titledesc').hide();
            }
        } if(mwb_ubo_count_of_usage_of_orderbump(order_bump_id) == 'negative') {
            alert('Limit reached for this Order Bump, try making another one');
            return false;
        }
        
        
    });
/*=======================================================================
                    Select the variations in popup.
========================================================================*/
    /*
     * POP-UP Select change JS,
     * To add the price html and image of selected variation in popup.
     */

    $(document).on( 'change', '.mwb_upsell_offer_variation_select', function(e) {

        var selected_order_bump_index = $(this).attr( 'order_bump_index' );

        // Order Bump Object.
        var parent_wrapper_class = '.mwb_ubo_wrapper_index_' + selected_order_bump_index;
        selected_order_bump = jQuery( parent_wrapper_class );

        // Order Bump Popup Object.
        var popup_wrapper_class = '.mwb_bump_popup_' + selected_order_bump_index;
        selected_order_bump_popup = jQuery( popup_wrapper_class );

        // Fetch selected attributes.
        // var selected_variations = $(this);
        var selected_variations = selected_order_bump_popup.find( '.mwb_upsell_offer_variation_select' );
        var attributes_selected = [];
        
        // Default image handle here.
        if( default_image == '' ) {

            if( selected_order_bump_popup.find( 'woocommerce-product-gallery__image' ) ) {

                default_image = selected_order_bump_popup.find( '.woocommerce-product-gallery__image' );
            }

            else {
                default_image = selected_order_bump_popup.find( '.woocommerce-placeholder' );
            }
        }

        for ( var i = selected_variations.length - 1; i >= 0; i-- ) {

            if( selected_variations[i].value == '' ) {

                // Default View on no selection.

                // ERROR 1.
                // selected_order_bump_popup.find( '.mwb_bump_popup_image' ).html( default_image );
                mwb_ubo_lite_intant_zoom_img( selected_order_bump_popup );
                selected_order_bump_popup.find( '.mwb_ubo_err_waring_for_variation').css( 'display','none' );
                selected_order_bump_popup.find( '.mwb_ubo_price_html_for_variation').css( 'display','block' );

                selected_order_bump_popup.find('.mwb_ubo_price_html_for_variation').css( 'display','none' );

                selected_order_bump_popup.find( '.mwb_ubo_bump_add_to_cart_button').css( 'display','none' );
                selected_order_bump_popup.find( '.mwb_ubo_price_html_for_variation').html( default_price );

               return;

            } else {
                attributes_selected[ selected_variations[i].id ] = selected_variations[i].value;
            }
        }

        /*
         * Got an array of all selected attribute.
         * Will run an ajax for search of attributes.
         * Show price and image.
         * Will see for variation id and in stock.
         * Add to cart button will be shown. 
         */

        // Converts attributes array in object.
        attributes_selected = Object.assign({}, attributes_selected );

        // Required Data.
        bump_id = selected_order_bump.find( '.offer_shown_id' ).val();
        bump_discount = selected_order_bump.find('.offer_shown_discount').val();

        jQuery.ajax({

            type: 'post',
            dataType: 'json',
            url: mwb_ubo_lite_public.ajaxurl,
            data: { 
                nonce : mwb_ubo_lite_public.auth_nonce, 
                action: 'search_variation_id_by_select' ,  
                attributes_selected_options: attributes_selected , 
                id: bump_id,
                discount: bump_discount,  
            },

            success: function( msg ){
                if( msg['key'] == 'stock' ) {

                    selected_order_bump_popup.find( '.mwb_ubo_err_waring_for_variation' ).css('display','flex');
                    selected_order_bump_popup.find( '.mwb_ubo_price_html_for_variation' ).css('display','none');
                    selected_order_bump_popup.find( '.mwb_ubo_bump_add_to_cart_button' ).css('display','none');

                    selected_order_bump_popup.find( '.mwb_bump_popup_image' ).html( msg['image'] );
                    mwb_ubo_lite_intant_zoom_img( selected_order_bump_popup );
                    selected_order_bump_popup.find( '.mwb_ubo_err_waring_for_variation' ).html( msg['message'] );

                } else if ( msg['key'] == 'not_available' ) {

                    selected_order_bump_popup.find( '.mwb_ubo_err_waring_for_variation' ).css('display','flex');
                    selected_order_bump_popup.find( '.mwb_ubo_price_html_for_variation' ).css('display','none');
                    selected_order_bump_popup.find( '.mwb_ubo_bump_add_to_cart_button' ).css('display','none');

                    selected_order_bump_popup.find( '.mwb_bump_popup_image' ).html( msg['image'] );
                    mwb_ubo_lite_intant_zoom_img( selected_order_bump_popup );
                    selected_order_bump_popup.find( '.mwb_ubo_err_waring_for_variation' ).html( msg['message'] );

                } else if ( ! isNaN( msg['key'] ) ) {

                    selected_order_bump_popup.find( '.mwb_ubo_err_waring_for_variation' ).css('display','none');
                    selected_order_bump_popup.find( '.mwb_ubo_price_html_for_variation' ).css('display','block');
                    selected_order_bump_popup.find( '.mwb_ubo_bump_add_to_cart_button' ).css('display','flex');

                    selected_order_bump_popup.find( '.mwb_bump_popup_image' ).html( msg['image'] );
                    mwb_ubo_lite_intant_zoom_img( selected_order_bump_popup );
                    selected_order_bump_popup.find( '.variation_id_selected' ).val( msg['key'] );
                    selected_order_bump_popup.find( '.mwb_ubo_price_html_for_variation' ).html( msg['message'] );
                }
            }
        });
    });

/*==========================================================================
                        Variation popup add to cart
============================================================================*/
    /*
     * POP-UP ADD TO CART BUTTON [ works with variable products].
     * To add the selected js.
     */
    $(document).on( 'click', '.mwb_ubo_bump_add_to_cart_button', function(e) {

        e.preventDefault();

        // Prevent mulitple clicks on this button.
        // $(this).prop( 'disabled', true );

        order_bump_index = $(this).attr( 'offer_bump_index' );
        if( typeof order_bump_index === 'undefined' ) {

            console.log( 'order bump not found' );
            return;
        }

        // Order Bump Object.
        var parent_wrapper_class = '.mwb_ubo_wrapper_index_' + order_bump_index;
        var selected_order_bump = jQuery( parent_wrapper_class );

        // Disable bump div.
        $( parent_wrapper_class ).css( 'pointer-events', 'none' );
        $( parent_wrapper_class ).css( 'opacity', '0.4' );

        // Required Data.
        bump_id = selected_order_bump.find( '.offer_shown_id' ).val();
        bump_discount = selected_order_bump.find('.offer_shown_discount').val();
        bump_target_cart_key = selected_order_bump.find('.target_id_cart_key').val();
        order_bump_id = selected_order_bump.find( '.order_bump_id' ).val();
        smart_offer_upgrade = selected_order_bump.find( '.order_bump_smo' ).val();
        // Check for pro.
        check_for_pro        = $('#bump_hidden_check_pro').val();
        // Show or hide the custom form.
        custom_form_toggle   = $('.custom_fields_for_orderbump_toggle').val();

        var variation_selected = '';
        jQuery( '.variation_id_selected' ).each(function(){

            if( jQuery(this).attr( 'offer_bump_index' ) == order_bump_index ) {

                variation_selected = jQuery(this).val();
            }
        });
        // array_variable_store_all_values = [];
        var ready = true;
        var data_arr = [];
        var keys = 0;

        // This should only run when the custom fields show option is enabled and the pro plugin is enabled.
        if( ( check_for_pro == 'active' ) && ( custom_form_toggle == 'show' ) ) {
            // We will now fetch the values.
            $('.mwb_bump_popup_custom_input_common_class_variation').each(function(){
                // var this_id    = jQuery(this).attr('id');
                obj = {};
                if( jQuery(this).val() == ''){
                    alert('Value not set for field'+jQuery(this).attr('name'));
                    ready = false;
                    return ready;
                } if(ready == true) {
                    // Push the values in an array.
                    obj.n  = jQuery(this).attr('name');
                    obj.i    = jQuery(this).attr('id');
                    obj.v = jQuery(this).val();
                    data_arr[keys] = obj;
                    keys++;
                    // v = jQuery(this).val();
                    // n = jQuery(this).attr('name');
                    // i = jQuery(this).attr('id');
                    // array_variable_store_all_values.push({id:i,name:n,value:v,variation_id:variation_selected});
                }
            });
        }
        if( ready == true ) {
            jQuery.ajax({

                type: 'post',
                dataType: 'json',
                url: mwb_ubo_lite_public.ajaxurl,
                data: { 
                    nonce                : mwb_ubo_lite_public.auth_nonce, 
                    action               : 'add_variation_offer_in_cart' ,
                    id                   : variation_selected, // variation offer product id.
                    parent_id            : bump_id, // variation offer parent product id.
                    discount             : bump_discount,
                    order_bump_id        : order_bump_id,
                    smart_offer_upgrade  : smart_offer_upgrade,
                    all_values           : data_arr,
                    bump_index           : order_bump_index,
                    bump_target_cart_key : bump_target_cart_key,
                    check_for_pro        : check_for_pro,
                    custom_form_toggle   : custom_form_toggle,
                },
                success: function( msg ) {
                    console.log(JSON.stringify(msg))
                    $('body').removeClass( 'mwb_upsell_variation_pop_up_body' );
                    $( '.mwb_bump_popup_wrapper' ).css( 'display','none' );
                    $( 'body' ).trigger( 'update_checkout' );
                    $( parent_wrapper_class ).css( 'pointer-events', 'all' );
                    $( parent_wrapper_class ).css( 'opacity', '1' );
                    $('.mwb_ubo_bump_add_to_cart_button').prop( 'disabled', false );
    
                    // When Reload is required.
                    if( 'subs_reload' == msg ) {
    
                        // Scroll Top and Reload.
                        $("html, body").scrollTop( 300 );
                        location.reload();
                    }
                }
            });
        }
    });
/*==========================================================================
                            Simple Popup Add to cart.
============================================================================*/
/**
 * When the submit button is clicked on the popup on the checkout page for simple products, this will
 * fetch the vales and call an ajax so that the process for adding the product to the cart
 * can be completed.
 * 
 * IMPORTANT:- The ajax should run only when all the fields have been updated.
 */
    jQuery(document).on('click','#mwb_bump_checkout_popup',function(e){
        
        e.preventDefault();
        // Prevent mulitple clicks on this button.
        order_bump_index     = $('.add_offer_in_cart').closest('.mwb_upsell_offer_main_wrapper').find( '.order_bump_index' ).val();
        parent_wrapper_class = '.mwb_ubo_wrapper_' + order_bump_index;
        
        // Order Bump Object.
        var selected_order_bump = jQuery( parent_wrapper_class );

        // Disable bump div.
        $( selected_order_bump ).css( 'pointer-events', 'none' );
        $( selected_order_bump ).css( 'opacity', '0.4' );

        // Required Data.
        bump_id = selected_order_bump.find( '.offer_shown_id' ).val();
        bump_discount = selected_order_bump.find('.offer_shown_discount').val();
        bump_target_cart_key = selected_order_bump.find('.target_id_cart_key').val();
        order_bump_id = selected_order_bump.find( '.order_bump_id' ).val();
        smart_offer_upgrade = selected_order_bump.find( '.order_bump_smo' ).val();

        // TO check if any field is left empty.  
        // Send custom fields data to first ajax , this will upload item meta.
        var ready = true;
        var data_arr = [];
        var keys = 0;
        $('.mwb_bump_popup_custom_input_common_class').each(function(){
            // var this_id    = jQuery(this).attr('id');
            obj = {};
            if( jQuery(this).val() == ''){
                alert('Value not set for field'+jQuery(this).attr('name'));
                ready = false;
                return ready;
            } if(ready = true) {
                // Push the values in an array.
                obj.n  = jQuery(this).attr('name');
                obj.i    = jQuery(this).attr('id');
                obj.v = jQuery(this).val();
                data_arr[keys] = obj;
                keys++;
            }
        });
        console.log(data_arr)
        if(data_arr.length != 0 && ready == true ) {
            var bump_product_id = jQuery('.offer_shown_id').val();
            $.ajax({
                    type: 'post',
                    url: mwb_ubo_lite_public.ajaxurl,
                    datatype : 'json',
                    data: { 
                        nonce : mwb_ubo_lite_public.auth_nonce,
                        action: 'add_simple_offer_in_cart',
                        id: bump_id, // offer product id.
                        discount: bump_discount,
                        bump_target_cart_key: bump_target_cart_key,
                        order_bump_id: order_bump_id,
                        smart_offer_upgrade: smart_offer_upgrade,
                        // Index : index_{ digit }
                        bump_index: order_bump_index,
                        all_values: data_arr,
                        bump_product_id : bump_product_id,
                    }, 
                    success: function( msg ) {
                        $( '.mwb_bump_popup_custom_input_wrapper' ).css( 'display','none' );
                        $( 'body' ).trigger( 'update_checkout' ); 
                        $( '.mwb_ubo_wrapper_' + order_bump_index ).css( 'pointer-events', 'all' );
                        $( '.mwb_ubo_wrapper_' + order_bump_index ).css( 'opacity', '1' );
                        console.log(JSON.parse(msg));
                        // When Reload is required.
                        if( 'subs_reload' == msg ) {
                            // Scroll Top and Reload.
                            $("html, body").scrollTop( 300 );
                            location.reload();
                        }
                }
            });
        }


        // // // 
        // if( ready == true ) {
             // Since array_variable_store_all_values is an object, it needs to be stringyfied.
            
        // }
         
    });

/*==========================================================================
                            Popup closing variable
============================================================================*/
    /*
     * POP-UP JS.
     * To hide on click close.
     */
    $(document).on( 'click', '.mwb_bump_popup_close', function(e) {

        order_bump_index = $(this).attr( 'offer_bump_index' );

        $( '.mwb_ubo_wrapper_index_' + order_bump_index ).css( 'pointer-events', 'all' );
        $( '.mwb_ubo_wrapper_index_' + order_bump_index ).css( 'opacity', '1' );
        $( 'body').removeClass( 'mwb_upsell_variation_pop_up_body' );
        $( '.mwb_bump_popup_' + order_bump_index ).css('display','none');
        $( '.mwb_ubo_wrapper_index_' + order_bump_index ).find( '.add_offer_in_cart' ).prop( 'checked', false );
    });

    // Onclick outside the div close the popup.
    $('mwb_bump_popup_wrapper').click
    (
      function(e){
        // if( e.target.className.search( 'mwb_bump_popup_wrapper' ) == 0 ) {
        //     order_bump_index = e.target.className.replace( 'mwb_bump_popup_wrapper mwb_bump_popup_','' );
            $( '.mwb_ubo_wrapper_index_' + order_bump_index ).css( 'pointer-events', 'all' );
            $( '.mwb_ubo_wrapper_index_' + order_bump_index ).css( 'opacity', '1' );
            $( 'body' ).removeClass( 'mwb_upsell_variation_pop_up_body' );
            $( '.mwb_bump_popup_wrapper' ).hide();
            $( '.mwb_ubo_wrapper_index_' + order_bump_index ).find( '.add_offer_in_cart' ).prop('checked', false);
        // }
      }
    );

/*==========================================================================
                            Close custom fields pop up simple
============================================================================*/
/*
     * Custom field POP-UP JS.
     * To hide on click close.
     */
    $(document).on( 'click', '.mwb_bump_popup_close_simple', function(e) {
        
        order_bump_index = $(this).attr( 'offer_bump_index' );
        $( '.mwb_ubo_wrapper_index_' + order_bump_index ).css( 'pointer-events', 'all' );
        $( '.mwb_ubo_wrapper_index_' + order_bump_index ).css( 'opacity', '1' );
        $( 'body').removeClass( 'mwb_upsell_variation_pop_up_body' );
        $( '.mwb_bump_popup_' + order_bump_index ).css('display','none');
        $( '.mwb_ubo_wrapper_index_' + order_bump_index ).find( '.add_offer_in_cart' ).prop('checked', false);
        //Adding the line here so that after closing the update action can be run else the popup was closing after split second.
        //$( 'body' ).trigger( 'update_checkout' );

    });
    
    // Onclick outside the div close the popup.
     $(document).on('click', '.mwb_bump_popup_custom_input_wrapper', function(e){
        if( e.target.className.search( 'mwb_bump_popup_custom_input_wrapper' ) == 0 ) {
           order_bump_index = e.target.className.replace( 'mwb_bump_popup_custom_input_wrapper mwb_bump_popup_','' );
            $( '.mwb_ubo_wrapper_index_' + order_bump_index ).css( 'pointer-events', 'all' );
            $( '.mwb_ubo_wrapper_index_' + order_bump_index ).css( 'opacity', '1' );
            $( 'body' ).removeClass( 'mwb_upsell_variation_pop_up_body' );
            $( '.mwb_bump_popup_custom_input_wrapper' ).hide();
            $( '.mwb_ubo_wrapper_index_' + order_bump_index ).find( '.add_offer_in_cart' ).prop('checked', false);
        }
     });

    
/*==========================================================================
                            Zooming Effect on mobile.
============================================================================*/
    if( mwb_ubo_lite_public.mobile_view != 1 ) {

        // Function for zooming image( not for mobile view ).
        $(document).on( 'hover', '.mwb_bump_popup_image', function(e) {

            // Block opening image.
            e.preventDefault();
            $('.woocommerce-product-gallery__image').zoom({
                magnify : 1.0  // Magnify upto 120 %.
            });
        });

    } else {

        $(document).on( 'click', '.mwb_bump_popup_image', function(e) {

            // Block opening image.
            e.preventDefault();
        });
    }

    




// END OF SCRIPT
});
