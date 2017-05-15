<?php
//
namespace App\Http\Controllers\v2;

use App\Models\v2\Ad;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\v2\Banner;
use Illuminate\Support\Facades\DB;

class BannerController extends Controller {

    /**
    * POST ecapi.banner.list
    */
    public function index(Request $request)
    {
        return $this->get($request);
//        $model = Banner::getList();
//        return $this->json($model);
    }

    public function get(Request $request){

//        $model = Banner::getList();
//        return $this->json($model);

        DB::enableQueryLog();
        $model = Ad::getListByPosition(['position_id'=>[1,2,3], 'per_page'=>10, 'page'=>1]);
        $sql = DB::getQueryLog();
        return $this->json($model);
    }
}
