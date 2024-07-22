export const createModalData= [
    {
      "label":"MB Included",
      "type":"text",
      "value":"",
      "mandatory":"true"
    },
    {
        "label":"Overage Rate Cost",
        "type":"text",
        "value":"",
        "mandatory":"true"
      },
      {
        "label":"Data Per Overage Charge (MB)",
        "type":"text",
        "value":"",
        "mandatory":"true"
      },
    {
      "label":"Rate Plan Type",
      "type":"dropdown",
      "value":["None","BTTS","Data Only","Hà Nội","Smartphone","VietNam"],
      "mandatory":"false"
      
    },
    {
      "label":"Default Optimization Group",
      "type":"dropdown",
      "value":["None",
       " Group With 20 Rate Plans",
       " Mel Test 20",
        "Melanie Test",
        "Melanie Test 2",
        "OPTEST",
        "Sài gòn",
        "Test Group"],
      "mandatory":"false"
    },
   
    {
      "label":"Pool SIMs?",
      "type":"checkbox",
      "value":"",
      "mandatory":"false"
    },
    {
      "label":"Exclude from Optimization?",
      "type":"checkbox",
      "value":"",
      "mandatory":"false"
    },
    {
        "label":"Retire Rate Plan?",
        "type":"checkbox",
        "value":"",
        "mandatory":"false"
      }
  ]