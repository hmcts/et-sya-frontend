// Performance in pipelines 

//===============================================================================================================
// Synthetic test script for: https://yrk32651.live.dynatrace.com/ui/settings/SYNTHETIC_TEST-58D99F542AAB721C/
//===============================================================================================================

this.requestBodyOne = """
{
  "frequencyMin": "5",
  "type": "BROWSER",
  "name": "CUI (ET) Applicant ET1 - Performance PoC (Reduced) - Preview",
  "locations": [
    "GEOLOCATION-F3E06A526BE3B4C4",
    "GEOLOCATION-F15152A6A059C277",
    "GEOLOCATION-871416B95457AB88"
  ],
  "manuallyAssignedApps": [],
  "enabled": "${}",
  "keyPerformanceMetrics": {
    "loadActionKpm": "VISUALLY_COMPLETE",
    "xhrActionKpm": "VISUALLY_COMPLETE"
  },
  "script": {
    "type": "clickpath",
    "version": "1.0",
    "configuration": {
      "device": {
        "deviceName": "Desktop",
        "orientation": "landscape"
      }
    },
        "events": [
        {
        "type": "navigate",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > div > div > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "description": "CUI_ET_Synthetic_010_LandingPage",
        "url": "AKS_TEST_URL" 
    }, {
        "type": "javascript",
        "description": "JS_Common",
        "javaScript": "//==================================================================\n//Get Current Date, day,month,year\n//==================================================================\n\nvar today = new Date();\nvar dd = String(today.getDate()).padStart(2, '0');\nvar mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0\nvar yyyy = today.getFullYear();\n\n//Set variables for use in later steps \napi.setValue('dateDay', dd);\napi.setValue('dateMonth', mm);\napi.setValue('dateYear', yyyy);\n\n//=================================================================\n//Set year Function (Past)\n//==================================================================\nfunction setPastYear(yearsToMinus) {\n    var today = new Date();\n    var yyyy = today.getFullYear();\n    var setYear = yyyy - yearsToMinus;\n\n    return setYear;\n}\n\n//==================================================================\n//Set Month Function (Future)\n//==================================================================\nfunction setFutureMonthYear(monthsToAdd, yyyy, mm) {\n    var futureMonth = parseInt(mm, 10) + monthsToAdd;\n    var futureYear = yyyy;\n\n    while (futureMonth > 12) {\n        futureMonth -= 12; // Reduce futureMonth by 12 (move to the next year's equivalent month)\n        futureYear += 1; // Increase the year\n    }\n\n    // Ensure the month is always two digits\n    futureMonth = String(futureMonth).padStart(2, '0');\n\n    return {\n        futureMonth,\n        futureYear\n    };\n}\n\n//==================================================================\n//Generate random string Function\n//==================================================================\nfunction generateRandomString(length) {\n    let result = \"\";\n    const characters = \"abcdefghijklmnopqrstuvwxyz\";\n    for (let i = 0; i < length; i++) {\n        result += characters.charAt(Math.floor(Math.random() * characters.length));\n    }\n    return result;\n}\n\n//=====================================================================\n// Set firstName and LastName vars\n//=====================================================================\n\nvar firstName = generateRandomString(5);\nvar lastName = generateRandomString(7);\n\napi.setValue(\"firstName\", firstName);\napi.setValue(\"lastName\", lastName);\n\n//==================================================================\n//Set year vars\n//==================================================================\n\n//var appBirthYear = setPastYear(38);\nvar employmentStartYear = setPastYear(5);\n\n//api.setValue(\"appBirthYear\", appBirthYear);\napi.setValue(\"employmentStartYear\", employmentStartYear);\n\n//==================================================================\n//Set months to add, future month & year\n//==================================================================\nvar monthsToAdd = 2;\n\nvar {\n    futureMonth,\n    futureYear\n} = setFutureMonthYear(monthsToAdd, yyyy, mm); // call function\n\napi.setValue('futureMonth', futureMonth);\napi.setValue('futureYear', futureYear);\napi.setValue('monthsToAdd', monthsToAdd)\n\n// Output\nconsole.log(futureMonth, futureYear);"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > div.govuk-grid-row > div > a"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "a:contains(\"Start now\")"
            }, {
                "type": "css",
                "value": "div:contains(\"Claims usually have to be made within 3 months of employment ending or problems happening. If a claim is late, you must explain why. A judge will then decide what happens next.\"):eq(2)"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-content div div a:nth-child(7)"
            }, {
                "type": "css",
                "value": "#main-content div.govuk-grid-row div.govuk-grid-column-full a.govuk-button"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_020_Start"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > div > div > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "a:contains(\"Continue\")"
            }, {
                "type": "css",
                "value": "div:contains(\"Continue\"):eq(2)"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-content div:nth-child(2) div a"
            }, {
                "type": "css",
                "value": "#main-content div.govuk-grid-row div.govuk-grid-column-full a.govuk-button"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_030_BeforeYouContinue"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#lip-or-representative"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"claimantRepresentedQuestion\"]:eq(0)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(0)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div input"
            }, {
                "type": "css",
                "value": "#lip-or-representative"
            }]
        },
        "button": 0,
        "description": "Click on \"I'm representing myself\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > div > div > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_040_ClaimYourself"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#single-or-multiple-claim"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"caseType\"]:eq(0)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(0)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div input"
            }, {
                "type": "css",
                "value": "#single-or-multiple-claim"
            }]
        },
        "button": 0,
        "description": "click on \"I’m claiming on my own\""
    },
    {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > div > div > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_050_ClaimOwnOrOthers"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#claim-jurisdiction"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"claimJurisdiction\"]:eq(0)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(0)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div input"
            }, {
                "type": "css",
                "value": "#claim-jurisdiction"
            }]
        },
        "button": 0,
        "description": "click on \"England and Wales\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > div > div > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_060_WhereYouCanMakeClaim"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#acas-multiple"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"acasMultiple\"]:eq(0)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(0)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div input"
            }, {
                "type": "css",
                "value": "#acas-multiple"
            }]
        },
        "button": 0,
        "description": "click on \"Yes\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-form > div.govuk-form-group.typeOfClaim > fieldset > legend > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_070_ACASCertificate"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#discrimination"
            }, {
                "type": "css",
                "value": "input[type=\"checkbox\"][name=\"typeOfClaim\"]:eq(1)"
            }, {
                "type": "css",
                "value": ".govuk-checkboxes__input:eq(1)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div:nth-child(2) input"
            }, {
                "type": "css",
                "value": "#discrimination"
            }]
        },
        "button": 0,
        "description": "click on \"Discrimination of any type\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#username"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_080_TypeOfClaimSubmit"
    }, {
        "type": "keystrokes",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#username"
            }, {
                "type": "css",
                "value": "input[type=\"text\"][name=\"username\"]"
            }, {
                "type": "css",
                "value": ".form-control:eq(0)"
            }, {
                "type": "css",
                "value": "#authorizeCommand div:nth-child(2) div div div:nth-child(2) input:nth-child(2)"
            }, {
                "type": "css",
                "value": "#username"
            }]
        },
        "masked": false,
        "simulateBlurEvent": true,
        "description": "keystrokes on \"Email address\"",
        "textValue": "et.citizen1UI@testmail.com"
    }, {
        "type": "keystrokes",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#password"
            }, {
                "type": "css",
                "value": "input[type=\"password\"][name=\"password\"]"
            }, {
                "type": "css",
                "value": ".form-control:eq(1)"
            }, {
                "type": "css",
                "value": "#authorizeCommand div:nth-child(2) div div div:nth-child(3) input:nth-child(2)"
            }, {
                "type": "css",
                "value": "#password"
            }]
        },
        "masked": false,
        "simulateBlurEvent": true,
        "description": "keystrokes on \"Password\"",
        "textValue": "Nagoya0102"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "input[type=\"submit\"][name=\"save\"]"
            }, {
                "type": "css",
                "value": ".button"
            }, {
                "type": "css",
                "value": "#authorizeCommand div:nth-child(2) div div div:nth-child(5) input"
            }, {
                "type": "css",
                "value": "#authorizeCommand div.grid-row div.column-one-half div.form-section div.login-list input.button"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_090_Login"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > div > div > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "a:contains(\"Continue\")"
            }, {
                "type": "css",
                "value": "div:contains(\"Save as draft\"):eq(5)"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "html body:nth-child(2) div:nth-child(8) div a"
            }, {
                "type": "css",
                "value": "body.govuk-template__body div.govuk-width-container div.govuk-button-group a.govuk-button:eq(2)"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_100_ClaimOneGoContinue"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "a:contains(\"Personal details\")"
            }, {
                "type": "css",
                "value": "span:contains(\"Personal details\")"
            }, {
                "type": "css",
                "value": "#main-content div div ol:nth-child(4) li ul:nth-child(2) li span a"
            }, {
                "type": "css",
                "value": "#main-content div.govuk-grid-row div.govuk-grid-column-two-thirds ol.app-task-list li ul.app-task-list__items li.app-task-list__item span.app-task-list__task-name--300px a:eq(0)"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_110_PersonalDetailsLink"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > div > div > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_120_DOBSaveContinue"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > div > div > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(5) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_130_SexSaveContinue"
    }, {
        "type": "keystrokes",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#addressEnterPostcode"
            }, {
                "type": "css",
                "value": "input[type=\"text\"][name=\"addressEnterPostcode\"]"
            }, {
                "type": "css",
                "value": ".govuk-input"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) input:nth-child(2)"
            }, {
                "type": "css",
                "value": "#addressEnterPostcode"
            }]
        },
        "masked": false,
        "simulateBlurEvent": true,
        "description": "keystrokes on \"Enter a UK postcode\"",
        "textValue": "wd6 4rt"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > div > div > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_140_AddressLookup"
    }, {
        "type": "javascript",
        "description": "JS_SelectRandomAddress",
        "javaScript": "var dropdown = document.querySelector(\"#addressAddressTypes\"); // Using CSS selector\n\n// Get all available options (excluding the first one if its a default placeholder)\nvar options = dropdown.getElementsByTagName(\"option\");\n\n// Randomly select an index\nvar randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;\n\n// Set the dropdown value to the randomly selected option\ndropdown.value = options[randomIndex].value;\n\n// Trigger the change event to register the selection\nvar event = new Event(\"change\", {\n    bubbles: true\n});\n\ndropdown.dispatchEvent(event);\n\nconsole.log(\"Selected random dropdown option:\", options[randomIndex].text);"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > div > div > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_150_AddressSaveContinue"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > div > div > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(7) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_160_AddressDetailsSaveContinue"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > div > div > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_170_TelephoneNumberSaveContinue"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#update-preference"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"claimantContactPreference\"]:eq(0)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(0)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div input"
            }, {
                "type": "css",
                "value": "#update-preference"
            }]
        },
        "button": 0,
        "description": "click on \"Email\""
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#update-preference-language-2"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"claimantContactLanguagePreference\"]:eq(1)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(3)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) fieldset div:nth-child(3) div:nth-child(2) input"
            }, {
                "type": "css",
                "value": "#update-preference-language-2"
            }]
        },
        "button": 0,
        "description": "click on \"English\""
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#update-hearing-language-2"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"claimantHearingLanguagePreference\"]:eq(1)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(4) fieldset div:nth-child(3) div:nth-child(2) input"
            }, {
                "type": "css",
                "value": "#update-hearing-language-2"
            }]
        },
        "button": 0,
        "description": "click on \"English\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > div > div > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(5) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_180_ContactMethodSaveContinue"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#hearingPreferences"
            }, {
                "type": "css",
                "value": "input[type=\"checkbox\"][name=\"hearingPreferences\"]:eq(0)"
            }, {
                "type": "css",
                "value": ".govuk-checkboxes__input:eq(0)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div input"
            }, {
                "type": "css",
                "value": "#hearingPreferences"
            }]
        },
        "button": 0,
        "description": "click on \"Yes, I can take part in video hearings\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-content > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_190_HearingFormatSaveContinue"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#reasonableAdjustments-2"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"reasonableAdjustments\"]:eq(1)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(1)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div:nth-child(3) input"
            }, {
                "type": "css",
                "value": "#reasonableAdjustments-2"
            }]
        },
        "button": 0,
        "description": "click on \"No - I do not need any extra support at this time\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "validation",
            "validation": {
                "target": {
                    "locators": [{
                        "type": "css",
                        "value": "#main-form > div.govuk-form-group.tasklist-check > fieldset > legend > h1"
                    }]
                },
                "type": "element_match",
                "failIfFound": false,
                "match": ""
            },
            "timeoutInMilliseconds": 5000
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_200_NeedSupportSaveContinue"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#tasklist-check"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"personalDetailsCheck\"]:eq(0)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(0)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div input"
            }, {
                "type": "css",
                "value": "#tasklist-check"
            }]
        },
        "button": 0,
        "description": "click on \"Yes, I've completed this section\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        """
this.requestBodyTwo = """{
        "button": 0,
        "description": "CUI_ET_Synthetic_210_PersonalDetailsSaveContinue",
        "validate": [{
            "target": {
                "locators": [{
                    "type": "css",
                    "value": "#main-content > div > div > ol > li:nth-child(1) > ul > li:nth-child(1) > strong"
                }]
            },
            "type": "element_match",
            "failIfFound": false,
            "isRegex": false,
            "match": "COMPLETED"
        }]
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "a:contains(\"Employment status\")"
            }, {
                "type": "css",
                "value": "span:contains(\"Employment status\")"
            }, {
                "type": "css",
                "value": "#main-content div div ol:nth-child(4) li:nth-child(2) ul:nth-child(2) li span a"
            }, {
                "type": "css",
                "value": "#main-content div.govuk-grid-row div.govuk-grid-column-two-thirds ol.app-task-list li ul.app-task-list__items li.app-task-list__item span.app-task-list__task-name--300px a:eq(3)"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_220_EmploymentStatusLink"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#past-employer"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"pastEmployer\"]:eq(0)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(0)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div input"
            }, {
                "type": "css",
                "value": "#past-employer"
            }]
        },
        "button": 0,
        "description": "click on \"Yes\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_230_PastEmployerSaveContinue"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#still-working-2"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"isStillWorking\"]:eq(1)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(1)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div:nth-child(2) input"
            }, {
                "type": "css",
                "value": "#still-working-2"
            }]
        },
        "button": 0,
        "description": "click on \"I'm working a notice period for the respondent\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_240_StillWorkingSaveContinue"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_250_EmploymentDetailsSaveContinue"
    }, {
        "type": "keystrokes",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#startDate-day"
            }, {
                "type": "css",
                "value": "input[type=\"text\"][name=\"startDate-day\"]"
            }, {
                "type": "css",
                "value": ".govuk-input:eq(0)"
            }, {
                "type": "css",
                "value": "#startDate div div input:nth-child(2)"
            }, {
                "type": "css",
                "value": "#startDate-day"
            }]
        },
        "masked": false,
        "simulateBlurEvent": true,
        "description": "keystrokes on \"Day\"",
        "textValue": "{dateDay}"
    }, {
        "type": "keystrokes",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#startDate-month"
            }, {
                "type": "css",
                "value": "input[type=\"text\"][name=\"startDate-month\"]"
            }, {
                "type": "css",
                "value": ".govuk-input:eq(1)"
            }, {
                "type": "css",
                "value": "#startDate div:nth-child(2) div input:nth-child(2)"
            }, {
                "type": "css",
                "value": "#startDate-month"
            }]
        },
        "masked": false,
        "simulateBlurEvent": true,
        "description": "keystrokes on \"Month\"",
        "textValue": "{dateMonth}"
    }, {
        "type": "keystrokes",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#startDate-year"
            }, {
                "type": "css",
                "value": "input[type=\"text\"][name=\"startDate-year\"]"
            }, {
                "type": "css",
                "value": ".govuk-input:eq(2)"
            }, {
                "type": "css",
                "value": "#startDate div:nth-child(3) div input:nth-child(2)"
            }, {
                "type": "css",
                "value": "#startDate-year"
            }]
        },
        "masked": false,
        "simulateBlurEvent": true,
        "description": "keystrokes on \"Year\"",
        "textValue": "{employmentStartYear}"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_260_StartDateSaveContinue"
    }, {
        "type": "keystrokes",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#notice-dates-day"
            }, {
                "type": "css",
                "value": "input[type=\"text\"][name=\"noticeEnds-day\"]"
            }, {
                "type": "css",
                "value": ".govuk-input:eq(0)"
            }, {
                "type": "css",
                "value": "#notice-dates div div input:nth-child(2)"
            }, {
                "type": "css",
                "value": "#notice-dates-day"
            }]
        },
        "masked": false,
        "simulateBlurEvent": true,
        "description": "keystrokes on \"Day\"",
        "textValue": "{dateDay}"
    }, {
        "type": "keystrokes",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#notice-dates-month"
            }, {
                "type": "css",
                "value": "input[type=\"text\"][name=\"noticeEnds-month\"]"
            }, {
                "type": "css",
                "value": ".govuk-input:eq(1)"
            }, {
                "type": "css",
                "value": "#notice-dates div:nth-child(2) div input:nth-child(2)"
            }, {
                "type": "css",
                "value": "#notice-dates-month"
            }]
        },
        "masked": false,
        "simulateBlurEvent": true,
        "description": "keystrokes on \"Month\"",
        "textValue": "{futureMonth}"
    }, {
        "type": "keystrokes",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#notice-dates-year"
            }, {
                "type": "css",
                "value": "input[type=\"text\"][name=\"noticeEnds-year\"]"
            }, {
                "type": "css",
                "value": ".govuk-input:eq(2)"
            }, {
                "type": "css",
                "value": "#notice-dates div:nth-child(3) div input:nth-child(2)"
            }, {
                "type": "css",
                "value": "#notice-dates-year"
            }]
        },
        "masked": false,
        "simulateBlurEvent": true,
        "description": "keystrokes on \"Year\"",
        "textValue": "{futureYear}"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_270_NoticePeriodSaveContinue"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_280_NumberMonthsSaveContinue"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_290_WeeklyHoursSaveContinue"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(6) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_300_YourPaySaveContinue"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(4) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_310_PensionSaveContinue"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(4) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_320_BenefitsSaveContinue"
    }, {
        "type": "keystrokes",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#respondentName"
            }, {
                "type": "css",
                "value": "input[type=\"text\"][name=\"respondentName\"]"
            }, {
                "type": "css",
                "value": ".govuk-input"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) input:nth-child(2)"
            }, {
                "type": "css",
                "value": "#respondentName"
            }]
        },
        "masked": false,
        "simulateBlurEvent": true,
        "description": "keystrokes on \"Enter name of respondent\"",
        "textValue": "{firstName}Resp {lastName}Resp"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_330_RespondentNameSaveContinue"
    }, {
        "type": "keystrokes",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#respondentEnterPostcode"
            }, {
                "type": "css",
                "value": "input[type=\"text\"][name=\"respondentEnterPostcode\"]"
            }, {
                "type": "css",
                "value": ".govuk-input"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) input:nth-child(3)"
            }, {
                "type": "css",
                "value": "#respondentEnterPostcode"
            }]
        },
        "masked": false,
        "simulateBlurEvent": true,
        "description": "keystrokes on \"Enter a UK postcode\"",
        "textValue": "AL2 2JX"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_340_RespondentAddressLookup"
    }, {
        "type": "javascript",
        "description": "JS_SelectRandomAddress",
        "javaScript": "var dropdown = document.querySelector(\"#respondentAddressTypes\"); // Using CSS selector\n\n// Get all available options (excluding the first one if its a default placeholder)\nvar options = dropdown.getElementsByTagName(\"option\");\n\n// Randomly select an index\nvar randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;\n\n// Set the dropdown value to the randomly selected option\ndropdown.value = options[randomIndex].value;\n\n// Trigger the change event to register the selection\nvar event = new Event(\"change\", {\n    bubbles: true\n});\n\ndropdown.dispatchEvent(event);\n\nconsole.log(\"Selected random dropdown option:\", options[randomIndex].text);"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_350_RespondentAddressSelectSaveContinue"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(7) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_360_RespondentAddressSaveContinue"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#work-address"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"claimantWorkAddressQuestion\"]:eq(0)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(0)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(2) div input"
            }, {
                "type": "css",
                "value": "#work-address"
            }]
        },
        "button": 0,
        "description": "click on \"Yes\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_370_WorkAddressSaveContinue"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#acasCert"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"acasCert\"]:eq(0)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(0)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div input"
            }, {
                "type": "css",
                "value": "#acasCert"
            }]
        },
        "button": 0,
        "description": "click on \"Yes\""
    }, {
        "type": "keystrokes",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#acasCertNum"
            }, {
                "type": "css",
                "value": "input[type=\"text\"][name=\"acasCertNum\"]"
            }, {
                "type": "css",
                "value": ".govuk-input"
            }, {
                "type": "css",
                "value": "#conditional-acasCert div input:nth-child(2)"
            }, {
                "type": "css",
                "value": "#acasCertNum"
            }]
        },
        "masked": false,
        "simulateBlurEvent": true,
        "description": "keystrokes on \"Enter an Acas early conciliation certificate number\"",
        "textValue": "R807115/23/89"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_380_ACASSaveContinue"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "a:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": "div:contains(\"Save and continue\"):eq(2)"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(6)"
            }, {
                "type": "css",
                "value": "#main-content div:nth-child(2) div a"
            }, {
                "type": "css",
                "value": "#main-content div.govuk-grid-row div.govuk-button-group a.govuk-button:eq(0)"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_390_RespondentCheckSaveContinue"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#tasklist-check"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"employmentAndRespondentCheck\"]:eq(0)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(0)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div input"
            }, {
                "type": "css",
                "value": "#tasklist-check"
            }]
        },
        "button": 0,
        "description": "click on \"Yes, I've completed this section\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_400_RespondentSubmitSaveContinue",
        "validate": [{
            "target": {
                "locators": [{
                    "type": "css",
                    "value": "#main-content > div > div > ol > li:nth-child(2) > ul > li:nth-child(1) > strong"
                }]
            },
            "type": "element_match",
            "failIfFound": false,
            "isRegex": false,
            "match": "COMPLETED"
        }]
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "a:contains(\"Describe what happened to you\")"
            }, {
                "type": "css",
                "value": "span:contains(\"Describe what happened to you\")"
            }, {
                "type": "css",
                "value": "#main-content div div ol:nth-child(4) li:nth-child(3) ul:nth-child(2) li span a"
            }, {
                "type": "css",
                "value": "#main-content div.govuk-grid-row div.govuk-grid-column-two-thirds ol.app-task-list li ul.app-task-list__items li.app-task-list__item span.app-task-list__task-name--300px a:eq(5)"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_410_ClaimDetailsStart"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#race"
            }, {
                "type": "css",
                "value": "input[type=\"checkbox\"][name=\"claimTypeDiscrimination\"]:eq(5)"
            }, {
                "type": "css",
                "value": ".govuk-checkboxes__input:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div:nth-child(6) input"
            }, {
                "type": "css",
                "value": "#race"
            }]
        },
        "button": 0,
        "description": "click on \"Race (including colour, nationality, and ethnic or national origins)\""
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#sex"
            }, {
                "type": "css",
                "value": "input[type=\"checkbox\"][name=\"claimTypeDiscrimination\"]:eq(7)"
            }, {
                "type": "css",
                "value": ".govuk-checkboxes__input:eq(7)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div:nth-child(8) input"
            }, {
                "type": "css",
                "value": "#sex"
            }]
        },
        "button": 0,
        "description": "click on \"Sex (including equal pay)\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_420_DiscriminationTypeSaveContinue"
    }, {
        "type": "keystrokes",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#claim-summary-text"
            }, {
                "type": "css",
                "value": "textarea[name=\"claimSummaryText\"]"
            }, {
                "type": "css",
                "value": "div:contains(\"Use this box to describe the events around your dispute, or add to your claim by uploading a document\"):eq(4)"
            }, {
                "type": "css",
                "value": ".govuk-textarea"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) div textarea:nth-child(3)"
            }, {
                "type": "css",
                "value": "#claim-summary-text"
            }]
        },
        "masked": false,
        "simulateBlurEvent": true,
        "description": "keystrokes on \"Describe what happened to you\"",
        "textValue": "random string and description but this kind of needs to be quite long as there is a large character limit. \n\nCreating a dummy padded response for testing purposes:\n\nI was employed by [Employer Name] from [Start Date] to [End Date] as a [Job Title]. Throughout my employment, I experienced ongoing discrimination based on my race, age, and sex, which created a hostile and unfair working environment.\n\nFrom the outset, I noticed that I was being treated differently from my colleagues. Despite my qualifications and experience, I was frequently overlooked for promotions and given fewer opportunities for professional development. On multiple occasions, management made comments suggesting that I did not fit the company’s \"culture\" or \"image,\" which I believe was coded language reflecting bias against me.\n\nIn particular, I was subjected to inappropriate remarks and microaggressions from both my line manager and colleagues. On several occasions, my concerns about workplace decisions were dismissed in a manner that was not consistent with how my peers were treated. I was regularly assigned the least desirable tasks and was excluded from key meetings where strategic decisions were made.\n\nFurthermore, I witnessed and personally experienced a pattern of discriminatory decision-making in disciplinary actions. For example, I was reprimanded for minor infractions, whereas other colleagues who engaged in similar behaviour faced no consequences. I also observed that hiring and promotion decisions consistently favoured individuals who did not share my protected characteristics.\n\nWhen I raised these concerns with HR, my complaints were not taken seriously. I was advised to \"be a team player\" and was made to feel as though speaking out would jeopardise my job. Following my complaints, I experienced retaliatory behaviour, including a sudden negative performance review and increased scrutiny of my work.\n\nUltimately, I believe my employment was unfairly terminated due to my race, age, and sex, and I am seeking redress for the financial and emotional impact of this discrimination."
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(6) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_430_WhatHappenedSaveContinue"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_440_WantFromClaimSaveContinue"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#linkedCases"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"linkedCases\"]:eq(0)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(0)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div input"
            }, {
                "type": "css",
                "value": "#linkedCases"
            }]
        },
        "button": 0,
        "description": "click on \"No\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(4) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_450_LinkedCasesSaveContinue"
    }, {
        "type": "click",
        "target": {
            "locators": [{
                "type": "css",
                "value": "#claim-details-check"
            }, {
                "type": "css",
                "value": "input[type=\"radio\"][name=\"claimDetailsCheck\"]:eq(0)"
            }, {
                "type": "css",
                "value": ".govuk-radios__input:eq(0)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(2) fieldset div:nth-child(3) div input"
            }, {
                "type": "css",
                "value": "#claim-details-check"
            }]
        },
        "button": 0,
        "description": "click on \"Yes, I've completed this section\""
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "button:eq(4)"
            }, {
                "type": "css",
                "value": "button:contains(\"Save and continue\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-form div:nth-child(3) button"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_460_ClaimSectionSaveContinue",
        "validate": [{
            "target": {
                "locators": [{
                    "type": "css",
                    "value": "#main-content > div > div > ol > li:nth-child(3) > ul > li:nth-child(1) > strong"
                }]
            },
            "type": "element_match",
            "failIfFound": false,
            "isRegex": false,
            "match": "COMPLETED"
        }]
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "a:contains(\"Check your answers\")"
            }, {
                "type": "css",
                "value": "span:contains(\"Check your answers\")"
            }, {
                "type": "css",
                "value": "#main-content div div ol:nth-child(4) li:nth-child(4) ul:nth-child(2) li span a"
            }, {
                "type": "css",
                "value": "#main-content div.govuk-grid-row div.govuk-grid-column-two-thirds ol.app-task-list li ul.app-task-list__items li.app-task-list__item span.app-task-list__task-name--300px a:eq(7)"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_470_CheckAnswersLink",
        "validate": [{
            "type": "text_match",
            "failIfFound": false,
            "isRegex": false,
            "match": "Equality and diversity questions"
        }]
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "button[type=\"submit\"][name=\"opt-out-button\"]"
            }, {
                "type": "css",
                "value": "button:contains(\"I don't want to answer these questions\")"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-content div div form ul:nth-child(5) li:nth-child(2) button"
            }, {
                "type": "css",
                "value": "#main-content div.govuk-grid-row div.govuk-grid-column-two-thirds form.form ul.govuk-form-group li button.govuk-button:eq(1)"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_480_EqualityOptOut"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "#main-form-submit"
            }, {
                "type": "css",
                "value": "a:contains(\"Submit\")"
            }, {
                "type": "css",
                "value": "div:contains(\"Save as draft\"):eq(1)"
            }, {
                "type": "css",
                "value": ".govuk-button:eq(5)"
            }, {
                "type": "css",
                "value": "#main-content div:nth-child(8) a"
            }, {
                "type": "css",
                "value": "#main-form-submit"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_490_FinalCheckSubmit",
        "validate": [{
            "target": {
                "locators": [{
                    "type": "css",
                    "value": "#main-content > div:nth-child(1) > div > div > h1"
                }]
            },
            "type": "element_match",
            "failIfFound": false,
            "isRegex": false,
            "match": "Your claim has been submitted"
        }]
    }, {
        "type": "javascript",
        "description": "JS_ExtractValues",
        "javaScript": "// Extract values from UI for later use\n\n// Using CSS selectors\nvar ccdCaseId = document.querySelector(\"#main-content > div:nth-child(1) > div > dl:nth-child(6) > div:nth-child(1) > dd\").textContent;\n\n//Store extracted values \napi.setValue(\"ccdCaseId\", ccdCaseId);\n\n\n//api.getValue(\"firstName\");\n//api.getValue(\"lastName\");\n\n//Log for verification/debugging\nconsole.log(\"Extracted CCD Case ID: \" + ccdCaseId + \"\\nApplicant First Name: \" + api.getValue(\"firstName\") + \"App\" + \"\\nApplicant Last Name: \" + api.getValue(\"lastName\") + \"App\" + \"\\nRespondent First Name: \" + api.getValue(\"firstName\") + \"Resp\" + \"\\nRespdonent Last Name: \" + api.getValue(\"lastName\") + \"Resp\");"
    }, {
        "type": "click",
        "wait": {
            "waitFor": "page_complete"
        },
        "target": {
            "locators": [{
                "type": "css",
                "value": "a:contains(\"Sign out\")"
            }, {
                "type": "css",
                "value": ".govuk-header__link:eq(2)"
            }, {
                "type": "css",
                "value": "#navigation li a"
            }, {
                "type": "css",
                "value": "#navigation li.govuk-header__navigation-item a.govuk-header__link"
            }]
        },
        "button": 0,
        "description": "CUI_ET_Synthetic_500_FinalCheckSubmit"
    }]
  },
  "tags": [
  {
    "context": "CONTEXTLESS",
    "key": "perf_synth_jurisdiction_app",
    "value": "perf_synth_et_cui"
  },
  {
    "context": "ENVIRONMENT",
    "key": "ENVIRONMENT",
    "value": "Preview"
  }
  ]
}"""

return this


