var tblRoster, tblData;

function hideLoader() {
    $("#loaderWrapper").css('display', 'none');
    $("body").css("backgroundColor", "white");
}

buildDataTable();

async function buildDataTable() {
    tblData = await fetch(`https://api.collegefootballdata.com/roster?team=Utah`).then(r => r.json()).then(d => d);
    console.log(tblData);
    tblRoster = $("table#tblRoster").DataTable({
        initComplete: function () {
            hideLoader();
            var totRows = this.api().rows()[0].length;
            this.api().columns(0).every(function () {
                var column = this;
                var select = $(
                    '<select class="custom-select custom-select-sm form-control form-control-sm"><option value="">ALL</option></select>'
                )
                    .appendTo($(column.footer()).empty())
                    .on('change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
                        column
                            .search(val ? '^' + val + '$' : '', true, false)
                            .draw();
                    });
                let t = typeof column.data().unique()[0];
                if (t === 'number') {
                    column.data().unique().sort((a, b) => a - b)
                        .each(function (d, j) {
                            select.append(`<option value="${d}">${d}</option>`);
                        });
                } else {
                    column.data().unique().sort()
                        .each(function (d, j) {
                            d = d === null ? '' :
                                select.append(
                                    `<option value="${d}">${d}</option>`);
                        });
                }
            });
        },
        select: true,
        dom: "<'row'<'col-sm-4 floatLeft'l><'col-sm-8 floatLeft'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        scrollY: "calc(100vh - 300px)",
        pageLength: 25,
        scrollCollapse: true,
        responsive: true,
        language: {
            search: "&telrec;",
            searchPlaceholder: "Search All Records"
        },
        data: tblData,
        columns: [{
            data: "jersey",
            title: "Jersey #",
            type: "num-fmt",
            class: 'alignLeft col0',
        }, {
            data: "last_name",
            title: "Last",
            type: "string",
            class: 'alignLeft col1'
        }, {
            data: "first_name",
            title: "First",
            type: "string",
            class: 'alignLeft col2'
        }, {
            data: "position",
            title: "Pos",
            type: "string",
            class: 'alignLeft col3'
        }, {
            data: "year",
            title: "Yr",
            type: "string",
            class: 'alignLeft col4',
            render: function (data, type, full, meta) {
                let yr;
                switch (data) {
                    case 1:
                        yr = `Fr`;
                        break;
                    case 2:
                        yr = `So`;
                        break;
                    case 3:
                        yr = `Jr`;
                        break;
                    case 4:
                        yr = `Sr`;
                        break;
                    default:
                        yr = `${data}th yr Sr`;
                }
                return type === "display" || type === "filter" ? yr : data;
            },
        }, {
            data: "weight",
            title: "Weight",
            type: "num-fmt",
            class: 'alignLeft',
            render: $.fn.dataTable.render.number(',', '.', 0, '', ' lbs.'),
        }, {
            data: "height",
            title: "Height",
            type: "num-fmt",
            class: 'alignLeft',
            render: function (data, type, full, meta) {
                let feet = Math.floor(data / 12);
                let inch = data % 12;
                return type === 'display' || type === 'filter' ?
                    `${feet}' ${inch}"` : data;
            }
        }, {
            data: "home_city",
            title: "City",
            type: "string",
            class: 'alignLeft',
        }, {
            data: "home_state",
            title: "St",
            type: "string",
            class: 'alignLeft',
            render: function (data, type, full, meta) {
                return type === 'display' && data !== null ? data.trim() : data;
            }
        }, {
            data: "home_country",
            title: "Cntry",
            type: "string",
            class: 'alignLeft',
        }],
    });
    tblRoster.columns().every(function () {
        var that = this;
        $('input', this.footer()).on('search keyup', function () {
            if (that.search() !== this.value) {
                that.search(this.value)
                    .draw();
            }
        });
    });
    window.addEventListener('resize', tblRoster.draw());
}
