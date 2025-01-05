(function () {
  console.log('catalog.element')

  function clicker(e) {
    var InputPriceCost
    var trigger
    var num = /[^\d]/g

    trigger = e.srcElement || e.target

    var decorItem = BX.findParent(BX(trigger), {
      'tag': 'div',
      'class': 'decor__item',
    })

    var costElement = BX.findChild(BX(decorItem), {
        'tag': 'p',
        'class': 'cost__item',
      },
      true,
    )

    var costItemInt = trigger.dataset.priceoform
    var costIntNum = costItemInt.replace(num, '')

    let costNumElements = document.querySelectorAll('.cost-num')

    if (costNumElements.length) {
      for (let i = 0, l = costNumElements.length; i < l; i++) {
        InputPriceCost = parseInt(costNumElements[i].innerHTML)

        if (trigger.checked) {
          costNumElements[i].innerHTML = InputPriceCost + parseInt(costIntNum)
        } else {
          costNumElements[i].innerHTML = InputPriceCost - parseInt(costIntNum)
        }
      }
    }

    if (trigger.checked) {
      costElement.classList.add('is-check')
    } else {
      costElement.classList.remove('is-check')
    }
  }

  BX.ready(function () {
    let cartLink = document.getElementById('cart-link')
    let preOrderLink = document.querySelector('.pre-order__btn')
    let costNumElements = document.querySelectorAll('.cost-num')
    let oformInput = document.querySelectorAll('.oform-input')

    if (oformInput) {
      oformInput.forEach(function (node) {
        node.addEventListener('change', clicker, false)

        if (costNumElements.length) {
          for (let i = 0, l = costNumElements.length; i < l; i++) {
            let costNow = Number(costNumElements[i].textContent.replace(/\D/g, ''))
            if (node.checked) {
              costNumElements[i].textContent = costNow + Number(node.dataset.priceoform)
            }
          }
        }
      })
    }

    let flowerToggleElement = document.querySelector('.decor_header')
    if (flowerToggleElement) {
      flowerToggleElement.addEventListener('click', function () {
        this.parentNode.classList.toggle('is-opened')
      })
    }

    //console.log($('#cart-link'));
    let userId = document.getElementById('card-oform-item').dataset.userid
    let offerChange = document.getElementById('flower--length')
    let cartLinkMore = document.getElementById('cart-link-more')
    let amount = document.getElementById('amount')
    let numberFlowersCount = document.querySelectorAll('.number--flowers')[0]
    let addCartWrap = document.querySelectorAll('.no-basket-product')[0]
    let addCartWrapMore = document.querySelectorAll('.add-basket-product')[0]
    /*let bonusNum = document.getElementById('bonus-number')
     let bonusPerc = bonusNum ? Number(bonusNum.dataset.bperc) : 0
     let bonusNumPrice = bonusNum ? Number(bonusNum.textContent) : 0*/
    let cartButtonsCustom = document.querySelectorAll('.catalog-item__to-cart')
    let cartNum = document.querySelectorAll('.header-cart__label')[0]
    let elemClick = document.getElementById('elem-click')
    let elemClickId = document.getElementById('elem-click-id')
    let elemClickPrice = document.getElementById('elem-click-price')
    let oneClickBtn = document.querySelectorAll('.catalog-item__buy-click, .buy-one-click')
    let offerChangeInputs = document.querySelectorAll('.flowers__price-input')
    let volumeChangeInputs = document.querySelectorAll('.flowers-volume__input')

    if (preOrderLink && !cartLink || cartLink) {
      if (offerChangeInputs.length) {
        for (let i = 0, l = offerChangeInputs.length; i < l; i++) {
          offerChangeInputs[i].addEventListener('change', function () {
            let selected
            for (let i = 0, l = offerChangeInputs.length; i < l; i++) {
              if (offerChangeInputs[i].checked) {
                selected = offerChangeInputs[i]
                break
              }
            }
            if (!selected) return

            if (selected.dataset.amount) {
              amount.value = selected.dataset.amount
            }

            let offerId = selected.dataset.iditem
            cartLink.dataset.iditemcart = offerId
            cartLinkMore.dataset.iditemcart = offerId

            if (costNumElements.length) {
              for (let i = 0, l = costNumElements.length; i < l; i++) {
                console.log(costNumElements[i], costNumElements[i].dataset.amount)

                let optPrice = Number(costNumElements[i].dataset.price)
                let parent = BX.findParent(costNumElements[i], { className: 'flowers__price' }, true)
                if (!parent) continue
                let offer = parent.querySelector('.flowers__price-input')
                if (!offer) continue
                costNumElements[i].textContent = optPrice * Number(offer.dataset.amount)

                let bonusNum = parent.querySelector('.bonus-number')

                if (!bonusNum) continue
                console.log(optPrice, Number(bonusNum.dataset.bperc))
                bonusNum.textContent = Math.floor((optPrice * Number(offer.dataset.amount)) / 100 * Number(bonusNum.dataset.bperc))
              }
            }

            //addCartWrapMore.style.display = 'none';
            let idoform = []
            oformInput.forEach(function (node) {
              if (node.checked) {
                idoform.push(node.dataset.idoform)
                if (costNumElements.length) {
                  for (let i = 0, l = costNumElements.length; i < l; i++) {
                    costNumElements[i].textContent = Number(costNumElements[i].textContent) + Number(node.dataset.priceoform)
                  }
                }
              }
            })
            let formData = new FormData()
            if (idoform.length > 0) {
              idoform = JSON.stringify(idoform)
              formData.append('idoforom', idoform)
            }
            formData.append('idprod', offerId)
            console.log(formData.idoform)
            fetch('/ajax/offerchange.php', {
              method: 'POST',
              body: formData,
            })
              .then(response => response.json())
              .then(res => {
                console.log(res)
                var numberCountInput = document.querySelector('.number-flowers__input')
                if (numberCountInput) numberCountInput.value = res.count
                if (res.count > 0) {
                  selected.dataset.amount = res.count
                  addCartWrapMore.removeAttribute('hidden')
                  addCartWrapMore.style.display = 'flex'
                  addCartWrap.hidden = true
                  numberFlowersCount.textContent = res.count
                } else {
                  selected.dataset.amount = 1
                  addCartWrap.removeAttribute('hidden')
                  addCartWrap.style.display = 'flex'
                  addCartWrapMore.hidden = true
                }
              })
              .catch(res => console.log(res))
          })
        }
      }

      if (volumeChangeInputs.length) {
        for (let i = 0, l = volumeChangeInputs.length; i < l; i++) {
          volumeChangeInputs[i].addEventListener('change', function () {
            let selected
            for (let i = 0, l = volumeChangeInputs.length; i < l; i++) {
              if (volumeChangeInputs[i].checked) {
                selected = volumeChangeInputs[i]
                break
              }
            }
            if (!selected) return

            if (selected.dataset.amount) {
              amount.value = selected.dataset.amount
            }

            let offerId = selected.dataset.iditem
            if (cartLink) {
              cartLink.dataset.iditemcart = offerId
              cartLinkMore.dataset.iditemcart = offerId
            } else if (preOrderLink) {
              preOrderLink.dataset.iditemcart = offerId
            }

            let priceOffer = selected.dataset.price

            console.log(priceOffer)

            let parent = BX.findParent(selected, { className: 'flowers--price__item' }, true)
            if (parent) {
              let costNum = parent.querySelector('.cost-num')
              if (costNum) {
                costNum.textContent = priceOffer * amount.value
                if (cartLink) {
                  cartLink.dataset.count = amount.value
                }

                oformInput.forEach(function (node) {
                  if (node.checked) {
                    costNum.textContent = Number(costNum.textContent) + Number(node.dataset.priceoform)
                  }
                })
              }
              let bonusNum = parent.querySelector('.bonus-number')
              if (bonusNum) {
                bonusNum.textContent = Math.floor(Number(priceOffer * selected.dataset.amount) / 100 * Number(bonusNum.dataset.bperc))
              }
            }

            //addCartWrapMore.style.display = 'none';
            let idoform = []
            oformInput.forEach(function (node) {
              if (node.checked) {
                idoform.push(node.dataset.idoform)
                if (costNumElements.length) {
                  for (let i = 0, l = costNumElements.length; i < l; i++) {
                    costNumElements[i].textContent = Number(costNumElements[i].textContent) + Number(node.dataset.priceoform)
                  }
                }
              }
            })
            let formData = new FormData()
            if (idoform.length > 0) {
              idoform = JSON.stringify(idoform)
              formData.append('idoforom', idoform)
            }
            formData.append('idprod', offerId)
            console.log(formData.idoform)
            fetch('/ajax/offerchange.php', {
              method: 'POST',
              body: formData,
            })
                .then(response => response.json())
                .then(res => {
                  console.log(res)
                  var numberCountInput = document.querySelector('.number-flowers__input')
                  if (numberCountInput) numberCountInput.value = res.count
                  if (res.count > 0) {
                    selected.dataset.amount = res.count
                    addCartWrapMore.removeAttribute('hidden')
                    addCartWrapMore.style.display = 'flex'
                    addCartWrap.hidden = true
                    numberFlowersCount.textContent = res.count
                  } else {
                    selected.dataset.amount = 1
                    addCartWrap.removeAttribute('hidden')
                    addCartWrap.style.display = 'flex'
                    addCartWrapMore.hidden = true
                  }
                })
                .catch(res => console.log(res))
          })
        }
      }
    }

    if (cartLink) {
      cartLink.addEventListener('click', function (e) {
        e.preventDefault()
        let idoform = []
        let cartNums = Number(cartNum.textContent)
        oformInput.forEach(function (node) {
          if (node.checked) {
            idoform.push(node.dataset.idoform)
          }
        })
        let formData = new FormData()
        if (idoform.length > 0) {
          idoform = JSON.stringify(idoform)
          console.log(idoform)
          formData.append('idoforom', idoform)
        }
        let count = this.dataset.count
        formData.append('count', count)
        formData.append('userId', userId)
        formData.append('idProduct', this.dataset.iditemcart)
        let countDataset = this.dataset.count
        fetch('/ajax/cartoformadd.php', {
          method: 'POST',
          body: formData,
        })
          .then(response => response.text())
          .then(res => {
            var modalId = 'basket-modal'
            var idModal = 'in-basket-modal'
            var popupElem = document.querySelector('#popupin-' + modalId)
            var numberCountInput = document.querySelector('.number-flowers__input')
            numberFlowersCount.innerHTML = countDataset
            cartNum.innerHTML = parseInt(cartNum.innerHTML) + 1
            cartNum.classList.remove('has-0')
            if (numberCountInput) {
              numberCountInput.value = count
            }
            if (popupElem) {
              popupElem.innerHTML = res
              let exitModal = popupElem.querySelectorAll('.modal--exit')
              if (exitModal) {
                for (var c = 0; c < exitModal.length; c++) {
                  exitModal[c].addEventListener('click', function (e) {
                    BX.Forms.FormsInit.modals[idModal].close()
                  })
                }
              }
              BX.Forms.FormsInit.modals[idModal].show()
            }
            return 1
          })
      })
      cartLinkMore.addEventListener('click', function (e) {
        e.preventDefault()
        let idoform = []
        let cartNums = Number(cartNum.textContent)
        oformInput.forEach(function (node) {
          if (node.checked) {
            idoform.push(node.dataset.idoform)
          }
        })
        let formData = new FormData()
        if (idoform.length > 0) {
          idoform = JSON.stringify(idoform)
          console.log(idoform)
          formData.append('idoforom', idoform)
        }
        //console.log(this.dataset.countone);
        //console.log(this.dataset.iditemcart);
        formData.append('count', this.dataset.countone)
        formData.append('idProduct', this.dataset.iditemcart)
        formData.append('userId', userId)

        fetch('/ajax/cartoformadd.php', {
          method: 'POST',
          body: formData,
        })
          .then(response => response.text())
          .then(res => {
            let selected
            for (let i = 0, l = offerChangeInputs.length; i < l; i++) {
              if (offerChangeInputs[i].checked) {
                selected = offerChangeInputs[i]
                break
              }
            }

            if (volumeChangeInputs) {
              for (let i = 0, l = volumeChangeInputs.length; i < l; i++) {
                if (volumeChangeInputs[i].checked) {
                  selected = volumeChangeInputs[i]
                  break
                }
              }
            }

            if (!selected) {
              selected = document.getElementById('cost-num')
            }

            let parent = BX.findParent(selected, { className: 'flowers__price' }, true)
            let costNum = parent.querySelector('.cost-num')

            costNum.innerText = Number(costNum.innerText) + Number(costNum.dataset.price)

            selected.dataset.amount = Number(selected.dataset.amount) + 1

            let bonusNum = parent.querySelector('.bonus-number')
            if (bonusNum) {
              let optPrice = Number(selected.dataset.price)
              bonusNum.innerText = Math.round((optPrice * selected.dataset.amount) * Number(bonusNum.dataset.bperc) / 100)
            }
            return 1
          })
      })

      //console.log(cartButtonsCustom);
      cartButtonsCustom.forEach(function (node) {
        node.addEventListener('click', function (e) {
          e.preventDefault()
          var formData = new FormData()
          // formData.append('ITEM_ID', this.dataset.itemid);
          // fetch('/ajax/popupbasket.php', {
          //     method: 'POST',
          //     body: formData
          // })
          formData.append('count', '1')
          formData.append('userId', userId)
          formData.append('idProduct', this.dataset.itemid)
          fetch('/ajax/cartoformadd.php', {
            method: 'POST',
            body: formData,
          })
            .then(response => response.text())
            .then(res => {
              var modalId = 'basket-modal'
              var idModal = 'in-basket-modal'
              var popupElem = document.querySelector('#popupin-' + modalId)
              var numberCountInput = document.querySelector('.number-flowers__input')
              cartNum.classList.remove('has-0')
              cartNum.innerHTML = parseInt(cartNum.innerHTML) + 1

              if (popupElem) {
                popupElem.innerHTML = res
                let exitModal = popupElem.querySelectorAll('.modal--exit')
                if (exitModal) {
                  for (var c = 0; c < exitModal.length; c++) {
                    exitModal[c].addEventListener('click', function (e) {
                      BX.Forms.FormsInit.modals[idModal].close()
                    })
                  }
                }
                BX.Forms.FormsInit.modals[idModal].show()
              }
              return 1
            })

        })
      })

      var spinnerMinus = document.querySelector('.c-spinner__minus')
      var spinnerPlus = document.querySelector('.c-spinner__plus')

      spinnerMinus.addEventListener('click', function () {
        var spinnetInput = document.querySelector('.c-spinner__input')

        if (spinnetInput.value > 1) {
          spinnetInput.value = parseInt(spinnetInput.value) - 1

          let selected
          for (let i = 0, l = offerChangeInputs.length; i < l; i++) {
            if (offerChangeInputs[i].checked) {
              selected = offerChangeInputs[i]
              break
            }
          }

          if (volumeChangeInputs) {
            for (let i = 0, l = volumeChangeInputs.length; i < l; i++) {
              if (volumeChangeInputs[i].checked) {
                selected = volumeChangeInputs[i]
                break
              }
            }
          }

          if (!selected) {
            selected = document.getElementById('cost-num')
          }

          if (selected) {
            selected.dataset.amount = spinnetInput.value

            let priceOffer = selected.dataset.price
            let parent = BX.findParent(selected, { className: 'flowers__price' }, true)
            if (parent) {
              let costNum = parent.querySelector('.cost-num')
              if (costNum) {
                costNum.textContent = priceOffer * spinnetInput.value

                cartLink.dataset.count = spinnetInput.value
                oformInput.forEach(function (node) {
                  if (node.checked) {
                    costNum.textContent = Number(costNum.textContent) + Number(node.dataset.priceoform)
                  }
                })
              }
              let bonusNum = parent.querySelector('.bonus-number')
              if (bonusNum) {
                bonusNum.textContent = Math.floor(Number(priceOffer * selected.dataset.amount) / 100 * Number(bonusNum.dataset.bperc))
              }
            }
          }
        }

      })

      spinnerPlus.addEventListener('click', function () {
        var spinnetInput = document.querySelector('.c-spinner__input')

        spinnetInput.value = parseInt(spinnetInput.value) + 1
        let selected
        for (let i = 0, l = offerChangeInputs.length; i < l; i++) {
          if (offerChangeInputs[i].checked) {
            selected = offerChangeInputs[i]
            break
          }
        }

        if (volumeChangeInputs) {
          for (let i = 0, l = volumeChangeInputs.length; i < l; i++) {
            if (volumeChangeInputs[i].checked) {
              selected = volumeChangeInputs[i]
              break
            }
          }
        }

        if (!selected) {
          selected = document.getElementById('cost-num')
        }

        if (selected) {
          selected.dataset.amount = spinnetInput.value

          let priceOffer = selected.dataset.price
          let parent = BX.findParent(selected, { className: 'flowers__price' }, true)
          if (parent) {
            let costNum = parent.querySelector('.cost-num')
            if (costNum) {
              costNum.textContent = priceOffer * spinnetInput.value

              cartLink.dataset.count = spinnetInput.value
              oformInput.forEach(function (node) {
                if (node.checked) {
                  costNum.textContent = Number(costNum.textContent) + Number(node.dataset.priceoform)
                }
              })
            }
            let bonusNum = parent.querySelector('.bonus-number')
            if (bonusNum) {
              bonusNum.textContent = Math.floor(Number(priceOffer * selected.dataset.amount) / 100 * Number(bonusNum.dataset.bperc))
            }
          }
        }
      })

      var addBasket = document.querySelector('.add--basket')
      var buskNumber = document.querySelector('.header-cart__label')

      if (addBasket) {
        addBasket.addEventListener('click', function () {
          var numberInput = document.querySelector('.number-flowers__input')
          var numberText = document.querySelector('.basket__number-flower .number--flowers')
          numberText.innerHTML = parseInt(numberInput.value) + 1
          numberInput.value = parseInt(numberInput.value) + 1
          // buskNumber.innerHTML = parseInt(buskNumber.innerHTML) + 1;
        })
      }
    }

    let flowersLenght = document.querySelectorAll('.flowers__length')[0]
    let cardSliderItems = document.querySelectorAll('.card-slider--items')[0]
    let simProdSlider = document.querySelectorAll('.similar-product__slider')[0]
    let simProdSlider1 = document.querySelectorAll('.similar-product__slider1')
    let addProdSlider = document.querySelectorAll('.add-product__slider')[0]

    if (flowersLenght) {
      new SlimSelect({
        select: document.querySelector('.flowers__length'),
        showSearch: false,
      })
    }

    if (oneClickBtn) {
      oneClickBtn.forEach(function (node) {
        node.addEventListener('click', function (e) {
          console.log(this)
          let selected
          for (let i = 0, l = offerChangeInputs.length; i < l; i++) {
            if (offerChangeInputs[i].checked) {
              selected = offerChangeInputs[i]
              break
            }
          }

          if (volumeChangeInputs) {
            for (let i = 0, l = volumeChangeInputs.length; i < l; i++) {
              if (volumeChangeInputs[i].checked) {
                selected = volumeChangeInputs[i]
                break
              }
            }
          }

          elemClick.value = this.dataset.onename
          elemClickId.value = this.dataset.product_id
          elemClickPrice.value = selected.dataset.price
        })
      })
    }
    var FlowersSlider
    if (cardSliderItems) {
      FlowersSlider = tns({
        container: '.card-slider--items',
        items: 1,
        slideBy: 'page',
        'mouseDrag': true,
        nav: false,
        controls: false,
        //controlsText: ['', ''],
        /*mode: 'gallery',*/
        loop: false,
        responsive: {
          0: {
            nav: true,
            controls: false,
            /*mode: 'carousel',*/
          },
          768: {
            nav: false,
            controls: false,
            /*mode: 'gallery',*/
          },
        },
      })
    }

    let thumbs = document.querySelector('.card-thumbs__list')
    if (thumbs) {
      tns({
        container: '.card-thumbs__list',
        items: 4,
        'mouseDrag': true,
        nav: false,
        controls: true,
        controlsText: ['', ''],
        mode: 'carousel',
        axis: 'vertical',
        loop: false,
        gutter: 24,
      })

      let items = document.querySelectorAll('.card-thumbs__img')
      if (items.length && FlowersSlider) {
        items[0].classList.add('is-active')
        for (let i = 0, l = items.length; i < l; i++) {
          items[i].addEventListener('click', function () {
            FlowersSlider.goTo(Number(this.dataset.index))
            for (let i = 0, l = items.length; i < l; i++) {
              items[i].classList.remove('is-active')
            }
            this.classList.add('is-active')
          })
        }
      }
    }

    if (simProdSlider) {
      var SimilarSlider = tns({
        container: '.similar-product__slider',
        items: 1,
        slideBy: 1,
        'mouseDrag': true,
        nav: false,
        controlsText: ['', ''],
        responsive: {
          535: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1315: {
            items: 4,
          },
        },
      })
    }

    if (simProdSlider1) {
      for (let i = 0; i < simProdSlider1.length; i++) {
        var SimilarSlider1 = tns({
          container: simProdSlider1[i],
          items: 1,
          slideBy: 1,
          'mouseDrag': true,
          nav: false,
          controlsText: ['', ''],
          responsive: {
            535: {
              items: 2,
            },
            768: {
              items: 3,
            },
            1315: {
              items: 4,
            },
          },
        })
      }
    }

    if (addProdSlider) {
      var AddProductSlider = tns({
        container: '.add-product__slider',
        items: 1,
        slideBy: 1,
        'mouseDrag': true,
        nav: false,
        controlsText: ['', ''],
        responsive: {
          535: {
            items: 2,
          },
          768: {
            items: 3,
          },
          1315: {
            items: 4,
          },
        },
      })
    }

    GLightbox({
      selector: '.glightbox-card',
    })

    // if (inputClassDecor) {
    //
    //     for (var i = 0; i < inputClassDecor.length; i++) {
    //         inputClassDecor[i].addEventListener('change', clicker, false);
    //     }
    //
    // };

  })

})()

