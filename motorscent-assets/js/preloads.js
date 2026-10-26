
    (function() {
      var preconnectOrigins = ["https://cdn.shopify.com"];
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills.Cm4XMvKf.js","/cdn/shopifycloud/checkout-web/assets/c1/app.SHLWvtfz.js","/cdn/shopifycloud/checkout-web/assets/c1/2c1ab0fe.DrXlxjip.js","/cdn/shopifycloud/checkout-web/assets/c1/6a2fc6d6.CJI9EBzg.js","/cdn/shopifycloud/checkout-web/assets/c1/3d539943.DdbJRwN5.js","/cdn/shopifycloud/checkout-web/assets/c1/bf3ecc32.Bu7BqsQ9.js","/cdn/shopifycloud/checkout-web/assets/c1/bfe75f31.XNH9aDXO.js","/cdn/shopifycloud/checkout-web/assets/c1/2255f8fa.Bw3Xl27I.js","/cdn/shopifycloud/checkout-web/assets/c1/7a2727a7.0kPkpEaa.js","/cdn/shopifycloud/checkout-web/assets/c1/cb38e5c2.CjTswK0q.js","/cdn/shopifycloud/checkout-web/assets/c1/7336bdaf.D4E5fPnS.js","/cdn/shopifycloud/checkout-web/assets/c1/54c78614.D8uH5JRS.js","/cdn/shopifycloud/checkout-web/assets/c1/e12db40c.Cei9yywI.js","/cdn/shopifycloud/checkout-web/assets/c1/b8733b27.C-Vxdjrd.js","/cdn/shopifycloud/checkout-web/assets/c1/e39bc11c.DmpxtC3O.js","/cdn/shopifycloud/checkout-web/assets/c1/08a3b809.DcsM_frO.js","/cdn/shopifycloud/checkout-web/assets/c1/6f2620f5.QDqlfiYO.js","/cdn/shopifycloud/checkout-web/assets/c1/164ad2e3.CwH6Mz8a.js","/cdn/shopifycloud/checkout-web/assets/c1/69fae6d4.6f5dKuiV.js","/cdn/shopifycloud/checkout-web/assets/c1/5c5817f3.BMwpmo9w.js","/cdn/shopifycloud/checkout-web/assets/c1/60a453ce.CR0hHCqn.js","/cdn/shopifycloud/checkout-web/assets/c1/fb3b4968.Cr9qtuth.js","/cdn/shopifycloud/checkout-web/assets/c1/f8706cb6.BIJsYpb4.js","/cdn/shopifycloud/checkout-web/assets/c1/dffdfb34.B6VBsGNg.js","/cdn/shopifycloud/checkout-web/assets/c1/3ca8ef7e.BvhDuERj.js","/cdn/shopifycloud/checkout-web/assets/c1/1f5e7811.C4W46W4I.js","/cdn/shopifycloud/checkout-web/assets/c1/1a6c2867.DIvU9A1-.js","/cdn/shopifycloud/checkout-web/assets/c1/2fdb3dd3.CEZt08mA.js","/cdn/shopifycloud/checkout-web/assets/c1/22345fd4.B44g3Wzf.js","/cdn/shopifycloud/checkout-web/assets/c1/0e67bd3b.CFPXbT7S.js","/cdn/shopifycloud/checkout-web/assets/c1/74835653.DKdMqDd-.js","/cdn/shopifycloud/checkout-web/assets/c1/a9fa9fda.IrHDMuvE.js","/cdn/shopifycloud/checkout-web/assets/c1/ca3e798e.W4FrD1ri.js","/cdn/shopifycloud/checkout-web/assets/c1/47b970b2.YyLpLqcM.js","/cdn/shopifycloud/checkout-web/assets/c1/064f6ac1.oV-BjDi_.js","/cdn/shopifycloud/checkout-web/assets/c1/efa0389a.CkWeRPH7.js","/cdn/shopifycloud/checkout-web/assets/c1/4b1c22b7.C7yr6lXS.js","/cdn/shopifycloud/checkout-web/assets/c1/17425706.BJOY59mQ.js","/cdn/shopifycloud/checkout-web/assets/c1/cb5cf153.BMRX3xib.js","/cdn/shopifycloud/checkout-web/assets/c1/e3e348f2.BqEgOFLe.js","/cdn/shopifycloud/checkout-web/assets/c1/cccd6056.oC970PVz.js","/cdn/shopifycloud/checkout-web/assets/c1/71ae3d5c.DB2OuCye.js","/cdn/shopifycloud/checkout-web/assets/c1/89e2d30a.Bd-othc6.js","/cdn/shopifycloud/checkout-web/assets/c1/ed9f2238.Bn8aU2w1.js","/cdn/shopifycloud/checkout-web/assets/c1/6fb6f9d8.A6iitB5j.js","/cdn/shopifycloud/checkout-web/assets/c1/1444e6bd.D6qPvwA_.js","/cdn/shopifycloud/checkout-web/assets/c1/0b8657b8.Qo1VJsDq.js","/cdn/shopifycloud/checkout-web/assets/c1/55098bf1.Cyd1Fv91.js","/cdn/shopifycloud/checkout-web/assets/c1/a422df8c.t4nwKqWg.js","/cdn/shopifycloud/checkout-web/assets/c1/f49d4216.BS-BbFx7.js","/cdn/shopifycloud/checkout-web/assets/c1/79974aab.BERqcwgH.js","/cdn/shopifycloud/checkout-web/assets/c1/7b0c98ea.BfmN_Jxi.js","/cdn/shopifycloud/checkout-web/assets/c1/d22d2b80.DEPc2DTg.js","/cdn/shopifycloud/checkout-web/assets/c1/f58f39d8.Bs0SKzng.js","/cdn/shopifycloud/checkout-web/assets/c1/e03065ab.jCXF5jt4.js","/cdn/shopifycloud/checkout-web/assets/c1/c09515bf.ByoyupTc.js","/cdn/shopifycloud/checkout-web/assets/c1/0e9ee714.C-Gv1day.js","/cdn/shopifycloud/checkout-web/assets/c1/39921a74.BXi49eYI.js","/cdn/shopifycloud/checkout-web/assets/c1/7a8217fd.DZoXpgux.js","/cdn/shopifycloud/checkout-web/assets/c1/8599b02a.DofVwCgl.js","/cdn/shopifycloud/checkout-web/assets/c1/6bfea526.CTWIiNT2.js","/cdn/shopifycloud/checkout-web/assets/c1/ac5a19ff.Bt6hk0ko.js","/cdn/shopifycloud/checkout-web/assets/c1/598fef4e.BGW4ub1X.js","/cdn/shopifycloud/checkout-web/assets/c1/e77f7fe0.DGfis-Kw.js","/cdn/shopifycloud/checkout-web/assets/c1/cc6ff67d.DUSvcd7z.js","/cdn/shopifycloud/checkout-web/assets/c1/bf513f9c.DXaa6CG4.js","/cdn/shopifycloud/checkout-web/assets/c1/dfca5da5.DYFuiicC.js","/cdn/shopifycloud/checkout-web/assets/c1/dae24aab.BOLYFqLb.js","/cdn/shopifycloud/checkout-web/assets/c1/ddf59287.C1Ek6eLr.js","/cdn/shopifycloud/checkout-web/assets/c1/01973ac7.9j6rkxKp.js","/cdn/shopifycloud/checkout-web/assets/c1/58314944.Be76U-TQ.js","/cdn/shopifycloud/checkout-web/assets/c1/945a08d6.SZuyciQJ.js","/cdn/shopifycloud/checkout-web/assets/c1/a25deb9a.BgSXOFux.js","/cdn/shopifycloud/checkout-web/assets/c1/2b89a178.Drk-K7o8.js","/cdn/shopifycloud/checkout-web/assets/c1/b684bff6.DiW0fRxu.js","/cdn/shopifycloud/checkout-web/assets/c1/d5d34b3b.ak9n343Q.js","/cdn/shopifycloud/checkout-web/assets/c1/910cd6e2.Bql4vfBf.js","/cdn/shopifycloud/checkout-web/assets/c1/347b440c.DUemaWAz.js","/cdn/shopifycloud/checkout-web/assets/c1/9ce08e25.D1d72JuB.js","/cdn/shopifycloud/checkout-web/assets/c1/181d38d3.c-2yN-Lj.js","/cdn/shopifycloud/checkout-web/assets/c1/5a347040.EMoF3psw.js","/cdn/shopifycloud/checkout-web/assets/c1/792bb671.B3OvVnSg.js","/cdn/shopifycloud/checkout-web/assets/c1/9ca7d819.NpaH5tsg.js","/cdn/shopifycloud/checkout-web/assets/c1/f51e663e.DatlrQZx.js","/cdn/shopifycloud/checkout-web/assets/c1/21cc90a2.DHzOO82q.js","/cdn/shopifycloud/checkout-web/assets/c1/64de7b49.BMitNVs5.js","/cdn/shopifycloud/checkout-web/assets/c1/ca0c3e72.RHZQk3QM.js","/cdn/shopifycloud/checkout-web/assets/c1/8e79be58.M8_ZMlHK.js","/cdn/shopifycloud/checkout-web/assets/c1/90e26f5f.CmyhHEUP.js","/cdn/shopifycloud/checkout-web/assets/c1/31cc568e.95lmLO5k.js","/cdn/shopifycloud/checkout-web/assets/c1/65f3d4da.Bb3QiqCm.js","/cdn/shopifycloud/checkout-web/assets/c1/ca5e9c49.B2MMSAkp.js","/cdn/shopifycloud/checkout-web/assets/c1/f3e117aa.DeiHvbUq.js","/cdn/shopifycloud/checkout-web/assets/c1/7aefefff.B2zkWw0-.js","/cdn/shopifycloud/checkout-web/assets/c1/b3389d5c.cyY2uCaO.js","/cdn/shopifycloud/checkout-web/assets/c1/73a9b0a0.B3wBRk9Z.js","/cdn/shopifycloud/checkout-web/assets/c1/86720dbb.B7k_31bL.js","/cdn/shopifycloud/checkout-web/assets/c1/0724c71d.CnoeHTvO.js","/cdn/shopifycloud/checkout-web/assets/c1/7114e006.B3Ce0bGV.js","/cdn/shopifycloud/checkout-web/assets/c1/9babe369.CtquJVus.js","/cdn/shopifycloud/checkout-web/assets/c1/434e3b0a.oup8Ur0H.js","/cdn/shopifycloud/checkout-web/assets/c1/e0989459.DjOHvEWz.js","/cdn/shopifycloud/checkout-web/assets/c1/cdfd59e6.vXk05BHQ.js","/cdn/shopifycloud/checkout-web/assets/c1/d2e6a587.DqA2LP0j.js","/cdn/shopifycloud/checkout-web/assets/c1/d7065744.D5Ci7dDo.js","/cdn/shopifycloud/checkout-web/assets/c1/ca3c8263.CkEDe0CI.js","/cdn/shopifycloud/checkout-web/assets/c1/083cdde5.BmER9Tu0.js","/cdn/shopifycloud/checkout-web/assets/c1/fe885b80.BjGO7nqZ.js","/cdn/shopifycloud/checkout-web/assets/c1/f78726c8.B2lrki3P.js","/cdn/shopifycloud/checkout-web/assets/c1/d93ca466.COTdW7AG.js","/cdn/shopifycloud/checkout-web/assets/c1/e129c76e.DpTkaciH.js","/cdn/shopifycloud/checkout-web/assets/c1/051149c8.lHD9iIAq.js","/cdn/shopifycloud/checkout-web/assets/c1/7ee73f43.IhrtwWrX.js","/cdn/shopifycloud/checkout-web/assets/c1/0c0ad074.8EteesDE.js","/cdn/shopifycloud/checkout-web/assets/c1/e477f96c.Bq675T7e.js","/cdn/shopifycloud/checkout-web/assets/c1/8fe56fc9.BqKkWLXV.js","/cdn/shopifycloud/checkout-web/assets/c1/2210eadb.DF0gIp_2.js","/cdn/shopifycloud/checkout-web/assets/c1/87bfafec.BHtzyeLJ.js","/cdn/shopifycloud/checkout-web/assets/c1/ec391382.Vg7KGKUt.js","/cdn/shopifycloud/checkout-web/assets/c1/c6b02d73.CtpT9YyM.js","/cdn/shopifycloud/checkout-web/assets/c1/71b60e0a.Bdvld-6t.js","/cdn/shopifycloud/checkout-web/assets/c1/7048f38b.DJlnGAAK.js","/cdn/shopifycloud/checkout-web/assets/c1/c3c7c048.CnK_ajbC.js","/cdn/shopifycloud/checkout-web/assets/c1/b9c0319a.B7q5Z0wb.js","/cdn/shopifycloud/checkout-web/assets/c1/7aa3b627.Ck4hS0By.js","/cdn/shopifycloud/checkout-web/assets/c1/dada7e07.CdfeTJWX.js","/cdn/shopifycloud/checkout-web/assets/c1/c10167e6.cQoFr4S8.js","/cdn/shopifycloud/checkout-web/assets/c1/17e57de1.DnrqCF_I.js"];
      var styles = ["/cdn/shopifycloud/checkout-web/assets/c1/assets/app.DBH01810.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/uuid.DDArxpAV.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/hydrate.DBXKff9z.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/OnePage.C_uC3EPz.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/VatNumberValidationField.Ch7X-JLn.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShopPayLogo.87JMHPUK.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/BillingAddressForm.BdwN7V1K.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PhoneField.uZEuHncj.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Popover.Bi1nHaU-.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Choice.BMdzfW_y.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useWalletsTimeout.Du9dByaI.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useApplePayButtonStatus.BnDF3H7t.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/EmptyState.BEvzDDvy.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/TransitionHeight.CuRoM9zv.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/StickyPayButton.D-gNjNDa.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Switch.BS8yVgoP.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useShopPayProgressIntercepts.CIy8uDiZ.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Tipping.BcTJoNaV.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentIcon.gzvCNwz_.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentLine.DT05kVlY.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Section.CU18S7Ap.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/findSelectedDeliveryMethod.xO_7ctnq.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Middot.D7Ujmshx.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/EstimatedDeliveryContent.B_THySFF.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShippingMethods.DU0m5rdF.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/ShippingMethodSelector.B0hio2RO.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/SubscriptionPriceBreakdown.vTcdVGq4.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/BelowTheFoldContent.DRJckcGa.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/RememberMeSection.JBO5WNhc.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentMethodProgressionHost.kQR0txJ7.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/RedirectionNotice.B8v_QGNW.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/MissingFields.BbxB_6wt.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/MobileOrderSummary.BlloiNDx.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useOnePageFormSubmit.1WzRSowg.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/checkout-pay-button-exit.KhTiKgPS.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/observe-fit-scale.DpLOWYa8.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useShopPayButtonClassName.DqjtNl7W.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/Payment.DrWvAMMF.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/PaymentOptionSelector.s-Kd_X2E.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/1037/8261/3375/files/motor-scent-checkout-logo-v5_x320.png?v=1792344778"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = preconnectOrigins.concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  